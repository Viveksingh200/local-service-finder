"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../context/languageContext";
import { useAuth } from "../context/authContext";
import { Globe, User, Calendar, LogOut, Briefcase } from "lucide-react";

export default function Navbar() {
  const { language, setSpecificLanguage, t } = useLanguage();
  const { user, workerProfile, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md shadow-orange-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            {t.brand}
          </span>
        </a>

        {/* Right Side Tools */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Language Toggle Switcher */}
          <div className="flex items-center gap-1 rounded-full border border-gray-200/80 p-0.5 bg-gray-50/50">
            <button
              onClick={() => setSpecificLanguage("en")}
              className={`px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                language === "en"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setSpecificLanguage("hi")}
              className={`px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                language === "hi"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Log-In and Sign-Up Actions (Hidden if logged in, otherwise visible) */}
          {!user ? (
            <>
              <a
                href="/login"
                className="hidden md:block text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                {t.login}
              </a>
              <a
                href="/register"
                className="hidden md:flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-[1.02]"
              >
                {t.register}
              </a>
            </>
          ) : null}

          {/* Profile Dropdown Button (Only Visible when Logged In) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:scale-105 transition-all duration-150 overflow-hidden cursor-pointer focus:outline-none"
              >
                <div className="relative h-full w-full">
                  {workerProfile?.profileImage ? (
                    <img
                      src={workerProfile.profileImage}
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-700 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  {/* Backdrop Close trigger */}
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setProfileDropdownOpen(false)}
                  ></div>

                  {/* Dropdown Card */}
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-150 bg-white p-2 shadow-lg z-20 focus:outline-none">
                    
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.role === "provider" ? "Worker" : user.role}</p>
                    </div>

                    <a
                      href={user.role === "admin" ? "/admin" : user.role === "provider" ? "/worker/dashboard" : "/profile"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-zinc-400" />
                      <span>{user.role === "admin" ? "Admin Panel" : user.role === "provider" ? "Worker Dashboard" : t.myProfile}</span>
                    </a>

                    <hr className="my-1.5 border-gray-100" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Mobile login/register link triggers for guests
            <div className="md:hidden">
              <a
                href="/login"
                className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                {t.login}
              </a>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
