"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../context/languageContext";
import { useAuth } from "../context/authContext";
import { Star } from "lucide-react";
import { API_BASE_URL } from "@/config";

export default function TopProfessionals() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [professionals, setProfessionals] = useState([]);

  const handleProfileClick = (e, slug) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.location.href = "/register";
    }
  };

  useEffect(() => {
    const fetchTopPros = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/workers?limit=4`);
        const data = await res.json();
        if (data.success && data.workers && data.workers.length > 0) {
          const mapped = data.workers.map((w) => ({
            name: w.name,
            role: w.profession,
            image: w.profileImage || "/professionals/sarah.png",
            rating: Math.round(w.rating) || 5,
            reviewsCount: w.totalReviews || 0,
            slug: w.slug
          }));
          setProfessionals(mapped);
        } else {
          setProfessionals(mockPros);
        }
      } catch (err) {
        console.error("Failed to load top professionals:", err);
        setProfessionals(mockPros);
      }
    };

    fetchTopPros();
  }, [t]);

  const mockPros = [
    {
      name: "Alex Morgan",
      role: t.plumber,
      image: "/professionals/alex.png",
      rating: 5,
      reviewsCount: 150,
      slug: "#"
    },
    {
      name: "Sarah Watson",
      role: t.cleaner,
      image: "/professionals/sarah.png",
      rating: 5,
      reviewsCount: 230,
      slug: "#"
    },
    {
      name: "Michael Chen",
      role: t.handyman,
      image: "/professionals/michael.png",
      rating: 5,
      reviewsCount: 190,
      slug: "#"
    },
    {
      name: "David Sherlock",
      role: t.electrician,
      image: "/professionals/david.png",
      rating: 5,
      reviewsCount: 210,
      slug: "#"
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 md:py-10 py-4 lg:px-8 bg-zinc-50/50 transition-colors duration-300">
      {/* Title */}
      <div className="pb-2">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">
          {t.topProfessionals}
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {professionals.map((pro, index) => (
          <div
            key={index}
            className="group overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full"
          >
            {/* Professional Image */}
            <a
              href={pro.slug && pro.slug !== "#" ? `/worker/${pro.slug}` : "/register"}
              onClick={(e) => handleProfileClick(e, pro.slug)}
              className="block relative aspect-square w-full overflow-hidden bg-zinc-100 cursor-pointer"
            >
              <Image
                src={pro.image}
                alt={pro.name}
                fill
                sizes="(max-w-7xl) 25vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority={index === 0}
              />
            </a>

            {/* Info details */}
            <div className="p-3 sm:p-5">
              <a
                href={pro.slug && pro.slug !== "#" ? `/worker/${pro.slug}` : "/register"}
                onClick={(e) => handleProfileClick(e, pro.slug)}
                className="cursor-pointer"
              >
                <h3 className="text-xs sm:text-base md:text-lg font-bold text-zinc-800 group-hover:text-amber-600 transition-colors truncate">
                  {pro.name}
                </h3>
              </a>
              <p className="mt-0.5 text-[10px] sm:text-sm font-medium text-zinc-500 truncate">
                {pro.role}
              </p>

              {/* Stars & Reviews */}
              <div className="mt-2 sm:mt-4 flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(pro.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400 shrink-0"
                    />
                  ))}
                </div>
                <span className="text-[9px] sm:text-xs text-zinc-500 truncate">
                  {pro.reviewsCount} {t.reviews}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
