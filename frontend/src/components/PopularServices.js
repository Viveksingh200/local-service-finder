"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/languageContext";
import {
  Snowflake,
  Wrench,
  Zap,
  WashingMachine,
  Sparkles,
  Leaf,
  HelpCircle
} from "lucide-react";

import { API_BASE_URL } from "@/config";

const BACKEND_URL = API_BASE_URL;

const iconMap = {
  Snowflake: Snowflake,
  Wrench: Wrench,
  Zap: Zap,
  WashingMachine: WashingMachine,
  Sparkles: Sparkles,
  Leaf: Leaf,
  HelpCircle: HelpCircle
};

const colorMap = {
  "ac-repair": { color: "text-blue-500", bgColor: "bg-blue-50" },
  "plumbing": { color: "text-amber-500", bgColor: "bg-amber-50" },
  "electrical": { color: "text-emerald-500", bgColor: "bg-emerald-50" },
  "appliance-repair": { color: "text-indigo-500", bgColor: "bg-indigo-50" },
  "house-cleaning": { color: "text-purple-500", bgColor: "bg-purple-50" },
  "gardening": { color: "text-green-500", bgColor: "bg-green-50" },
};

const defaultColors = [
  { color: "text-orange-500", bgColor: "bg-orange-50" },
  { color: "text-rose-500", bgColor: "bg-rose-50" },
  { color: "text-cyan-500", bgColor: "bg-cyan-50" },
  { color: "text-teal-500", bgColor: "bg-teal-50" },
  { color: "text-pink-500", bgColor: "bg-pink-50" }
];

export default function PopularServices() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined localized services fallback if server returns empty or fails
  const fallbackServices = [
    {
      name: t.acRepair,
      slug: "ac-repair",
      icon: "Snowflake",
    },
    {
      name: t.plumbing,
      slug: "plumbing",
      icon: "Wrench",
    },
    {
      name: t.electrical,
      slug: "electrical",
      icon: "Zap",
    },
    {
      name: t.applianceRepair,
      slug: "appliance-repair",
      icon: "WashingMachine",
    },
    {
      name: t.houseCleaning,
      slug: "house-cleaning",
      icon: "Sparkles",
    },
    {
      name: t.gardening,
      slug: "gardening",
      icon: "Leaf",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/categories`);
        const data = await res.json();
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(fallbackServices);
        }
      } catch (err) {
        console.error("Failed to load homepage categories, using fallback:", err);
        setCategories(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 md:py-10 py-4 lg:px-8 bg-transparent">
        <div className="pb-1">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">
            {t.popularTitle}
          </h2>
        </div>
        <div className="mt-8 flex flex-row overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 md:pb-0 scrollbar-none">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-white p-5 md:p-6 text-center shadow-sm w-36 md:w-auto shrink-0 md:shrink animate-pulse"
            >
              <div className="h-12 w-12 rounded-lg bg-zinc-100"></div>
              <div className="mt-4 h-4 w-20 rounded bg-zinc-100"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 md:py-10 py-4 lg:px-8 bg-transparent transition-colors duration-300">
      {/* Title Header */}
      <div className="pb-1">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">
          {t.popularTitle}
        </h2>
      </div>

      {/* Responsive layout: scrollable row on mobile, full grid on desktop */}
      <div className="mt-8 flex flex-row overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 md:pb-0 scrollbar-none scroll-smooth">
        {categories.map((cat, index) => {
          const slug = cat.slug || "";
          const styling = colorMap[slug] || defaultColors[Math.abs(slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaultColors.length];
          const Icon = iconMap[cat.icon] || Wrench;

          return (
            <a
              href={`/workers?category=${encodeURIComponent(cat.name)}`}
              key={index}
              className="group flex flex-col items-center justify-center rounded-lg bg-white p-5 md:p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer w-36 md:w-auto shrink-0 md:shrink"
            >
              {/* Icon container */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${styling.bgColor} ${styling.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-6 w-6" />
              </div>
              
              {/* Service name */}
              <h3 className="mt-4 text-sm font-semibold text-zinc-800 group-hover:text-zinc-950 transition-colors truncate w-full px-1">
                {cat.name}
              </h3>
            </a>
          );
        })}
      </div>
    </section>
  );
}
