"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "provider" (Worker)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name || !email || !phone || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      email,
      phone,
      password,
      role
    };

    const res = await register(payload);
    if (res.success) {
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(res.message || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-100">
      <div className="bg-white px-8 py-10 rounded-xl shadow-sm w-full max-w-md border border-zinc-200/50">
        
        {/* heading */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col justify-center gap-3 items-center">
            <h2 className="font-bold text-3xl mx-auto text-zinc-900">{t.registerTitle}</h2>
            <p className="text-zinc-400 md:text-sm text-xs text-center">
              {t.registerSubtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-xs font-semibold p-3 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          {/* input form */}
          <div className="flex flex-col mt-1 gap-2">
            <label htmlFor="name" className="text-zinc-700 font-semibold text-sm">{t.fullName}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="px-4 py-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-800"
              required
            />

            <label htmlFor="email" className="text-zinc-700 font-semibold text-sm">{t.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="px-4 py-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-800"
              required
            />

            <label htmlFor="phone" className="text-zinc-700 font-semibold text-sm">
              {t.phoneNumber}
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="px-4 py-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-800"
              required
            />

            <label htmlFor="password" className="text-zinc-700 font-semibold text-sm">
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="px-4 py-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-800"
              required
            />

            <label htmlFor="role" className="text-zinc-700 font-semibold text-sm">{t.role}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm bg-white text-zinc-800"
            >
              <option value="user">{t.roleUser}</option>
              <option value="provider">{t.roleWorker}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2.5 text-base tracking-wide font-semibold cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Registering..." : t.register}
          </button>

          <p className="text-xs text-zinc-500 self-center font-medium">
            {t.alreadyHaveAccount}
            <Link href="/login" className="text-orange-600 hover:text-amber-600 font-bold hover:underline transition-colors ml-1">
              {t.login}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
