"use client";

import { API_BASE_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { User, Lock, Save, KeyRound, CheckCircle, ArrowLeft, ShieldAlert } from "lucide-react";

export default function WorkerProfilePage() {
  const { user, workerProfile, loading, updateProfileState } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Redirect if not logged in or not a provider
  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Form states for profile details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState(0);
  const [description, setDescription] = useState("");
  const [serviceCategories, setServiceCategories] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Set user and profile details on load
  useEffect(() => {
    if (workerProfile) {
      setName(workerProfile.name || "");
      setPhone(workerProfile.phone || "");
      setEmail(workerProfile.email || "");
      setProfession(workerProfile.profession || "");
      setExperience(workerProfile.experience || 0);
      setDescription(workerProfile.description || "");
      setServiceCategories(workerProfile.serviceCategories?.join(", ") || "");
      setServiceAreas(workerProfile.serviceAreas?.join(", ") || "");
      setCity(workerProfile.city || "");
      setArea(workerProfile.area || "");
      setProfileImage(workerProfile.profileImage || "");
      setAadhaarNumber(workerProfile.aadhaarNumber || "");
    }
  }, [workerProfile]);

  if (loading || !user || !workerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-semibold animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  // Handle Save Worker Profile details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError("");
    setProfileSuccess("");

    const token = localStorage.getItem("authToken");
    const categoriesArray = serviceCategories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    const areasArray = serviceAreas
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "");

    try {
      const res = await fetch(`${API_BASE_URL}/workers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          profession,
          experience: parseInt(experience),
          description,
          serviceCategories: categoriesArray,
          serviceAreas: areasArray,
          city,
          area,
          profileImage,
          aadhaarNumber
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      updateProfileState(data.worker);
      setProfileSuccess("Professional profile updated successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      setProfileError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      setUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      setUpdatingPassword(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(err.message || "Something went wrong.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/worker/dashboard")}
              className="flex items-center gap-1.5 text-xs font-bold bg-zinc-150/80 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 px-3.5 py-1.5 rounded-full transition-all mb-4 cursor-pointer shadow-sm w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
              {language === "hi" ? "व्यावसायिक प्रोफ़ाइल और सेटिंग्स" : "Professional Profile & Settings"}
            </h1>
            <p className="text-xs text-zinc-400 font-semibold uppercase mt-1 tracking-wider">
              {language === "hi" ? "सत्यापन विवरण, सेवा सूची और पासवर्ड प्रबंधित करें" : "Manage verification details, service listings and password"}
            </p>
          </div>
        </div>

        {/* Global Notifications */}
        {profileError && (
          <div className="bg-red-50 text-red-650 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-red-500/5">
            {profileError}
          </div>
        )}
        {profileSuccess && (
          <div className="bg-emerald-50 text-emerald-755 text-emerald-700 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-emerald-500/5 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{profileSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Edit Profile details Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-zinc-200/50">
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                
                {/* Section title: Personal Details */}
                <div>
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "1. व्यक्तिगत विवरण" : "1. Personal Information"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{t.fullName}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{t.phoneNumber}</label>
                      <input
                        type="text"
                        value={phone}
                        disabled
                        className="px-4 py-2.5 bg-zinc-50 text-zinc-400 rounded-xl text-sm cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{t.email}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section title: Professional Details */}
                <div className="mt-2">
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "2. व्यावसायिक विवरण" : "2. Professional Information"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "व्यवसाय" : "Profession"}</label>
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g. Electrician"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "अनुभव (वर्षों में)" : "Experience (in Years)"}</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा श्रेणियां (अल्पविराम से अलग करें)" : "Service Categories"}</label>
                      <input
                        type="text"
                        value={serviceCategories}
                        onChange={(e) => setServiceCategories(e.target.value)}
                        placeholder="e.g. Electrical, Appliance Repair"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा विवरण" : "Service Description"}</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about your expertise..."
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "शहर" : "City"}</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "लोकेशन/क्षेत्र" : "Area"}</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Belapur"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा क्षेत्र (अल्पविराम से अलग करें)" : "Areas Served"}</label>
                      <input
                        type="text"
                        value={serviceAreas}
                        onChange={(e) => setServiceAreas(e.target.value)}
                        placeholder="e.g. Belapur, Seawoods"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section title: verification credentials */}
                <div className="mt-2">
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "3. सत्यापन एवं मीडिया" : "3. Identity Verification & Media"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "प्रोफ़ाइल फोटो URL" : "Profile Photo URL"}</label>
                      <input
                        type="text"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "आधार कार्ड नंबर" : "Aadhaar Card Number"}</label>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        placeholder="e.g. 123456789012"
                        maxLength={12}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 text-white py-3 font-extrabold text-sm hover:from-zinc-950 hover:to-black shadow-md shadow-zinc-900/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? (language === "hi" ? "सहेज रहा है..." : "Saving...") : (language === "hi" ? "विवरण सहेजें" : "Save Profile Details")}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Profile Verification alerts & Password Card */}
          <div className="flex flex-col gap-6">
            {/* Verification status card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h3 className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-wider mb-4">
                {language === "hi" ? "सत्यापन की स्थिति" : "Verification Status"}
              </h3>

              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${workerProfile.approved ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-bold">
                  {workerProfile.approved
                    ? (language === "hi" ? "प्रोफ़ाइल स्वीकृत और लाइव है" : "Profile Approved & Active")
                    : (language === "hi" ? "स्वीकृति लंबित है" : "Pending Administrator Review")}
                </span>
              </div>

              {!workerProfile.approved && (
                <div className="mt-4 flex items-start gap-2.5 bg-red-50/50 p-4 rounded-2xl text-red-750 text-[11px] leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    {language === "hi"
                      ? "समीक्षा के बाद व्यवस्थापक आपकी प्रोफ़ाइल स्वीकृत करेंगे।"
                      : "Once standard verification details are validated, the administrator will approve your search listing."}
                  </p>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h2 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <KeyRound className="h-4.5 w-4.5 text-orange-600 shrink-0" />
                <span>{language === "hi" ? "पासवर्ड बदलें" : "Reset Password"}</span>
              </h2>

              {passwordError && (
                <div className="bg-red-50 text-red-655 text-[11px] font-semibold p-3.5 rounded-xl mb-4">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold p-3.5 rounded-xl mb-4 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "वर्तमान पासवर्ड" : "Current Password"}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "नया पासवर्ड" : "New Password"}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "नए पासवर्ड की पुष्टि करें" : "Confirm Password"}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 font-bold text-xs hover:from-amber-600 hover:to-orange-700 shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{updatingPassword ? (language === "hi" ? "अपडेट हो रहा है..." : "Updating...") : (language === "hi" ? "पासवर्ड अपडेट करें" : "Update Password")}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
