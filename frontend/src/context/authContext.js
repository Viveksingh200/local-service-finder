"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";

const AuthContext = createContext(null);

const BACKEND_URL = API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth token in cookies (for SSR access) and localStorage
  const setAuthSession = (token, refreshToken, userData, workerData) => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      if (workerData) {
        localStorage.setItem("authWorker", JSON.stringify(workerData));
      } else {
        localStorage.removeItem("authWorker");
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Save token to cookie with 7 days expiration for SSR
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `authToken=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      
      setUser(userData);
      setWorkerProfile(workerData || null);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authWorker");
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      setUser(null);
      setWorkerProfile(null);
    }
  };

  // Helper to call backend /refresh endpoint and get a new access token
  const refreshSession = async () => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) {
      return false;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: savedRefreshToken })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `authToken=${data.accessToken}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        
        return data.accessToken;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      return false;
    }
  };

  // Load user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("authUser");
      const savedWorker = localStorage.getItem("authWorker");

      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser));
        if (savedWorker) {
          setWorkerProfile(JSON.parse(savedWorker));
        }

        // Validate token with server to keep it fresh
        try {
          const res = await fetch(`${BACKEND_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            setWorkerProfile(data.workerProfile || null);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            if (data.workerProfile) {
              localStorage.setItem("authWorker", JSON.stringify(data.workerProfile));
            } else {
              localStorage.removeItem("authWorker");
            }
          } else {
            // Token invalid or expired, try refreshing
            const newAccessToken = await refreshSession();
            if (newAccessToken) {
              const retryRes = await fetch(`${BACKEND_URL}/user/me`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              const retryData = await retryRes.json();
              if (retryData.success) {
                setUser(retryData.user);
                setWorkerProfile(retryData.workerProfile || null);
                localStorage.setItem("authUser", JSON.stringify(retryData.user));
                if (retryData.workerProfile) {
                  localStorage.setItem("authWorker", JSON.stringify(retryData.workerProfile));
                } else {
                  localStorage.removeItem("authWorker");
                }
              } else {
                setAuthSession(null);
              }
            } else {
              setAuthSession(null);
            }
          }
        } catch (err) {
          console.error("Auth validation failed:", err);
          // Try validating using refresh token on validation errors (e.g. timeout / temporary token fail)
          const newAccessToken = await refreshSession();
          if (!newAccessToken) {
            console.log("Could not validate or refresh session. Logged out.");
          }
        }
      } else if (localStorage.getItem("refreshToken")) {
        // Access token missing but refresh token exists, restore session
        const newAccessToken = await refreshSession();
        if (newAccessToken) {
          try {
            const res = await fetch(`${BACKEND_URL}/user/me`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            const data = await res.json();
            if (data.success) {
              setUser(data.user);
              setWorkerProfile(data.workerProfile || null);
              localStorage.setItem("authUser", JSON.stringify(data.user));
              if (data.workerProfile) {
                localStorage.setItem("authWorker", JSON.stringify(data.workerProfile));
              }
            } else {
              setAuthSession(null);
            }
          } catch (err) {
            console.error("Session recovery profile fetch failed:", err);
          }
        } else {
          setAuthSession(null);
        }
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  // Silent token refresh timer and focus restoration
  useEffect(() => {
    if (!user) return;

    // Silent refresh every 10 minutes to stay fresh
    const intervalId = setInterval(async () => {
      console.log("Performing periodic silent token refresh...");
      await refreshSession();
    }, 10 * 60 * 1000);

    // Refresh when user returns to/focuses the tab (e.g., wake from sleep)
    const handleFocus = async () => {
      console.log("Tab focused, restoring access token freshness...");
      await refreshSession();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user]);

  const login = async (phone, password) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      setAuthSession(data.data.token, data.data.refreshToken, data.data.user, data.data.workerProfile);
      return { success: true, user: data.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (registerData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setAuthSession(null);
    window.location.href = "/login";
  };

  const updateProfileState = (updatedWorker) => {
    setWorkerProfile(updatedWorker);
    localStorage.setItem("authWorker", JSON.stringify(updatedWorker));
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        updateUserState,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isWorker: user?.role === "provider"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
