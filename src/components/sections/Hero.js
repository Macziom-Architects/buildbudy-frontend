"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

const TRENDING_TAGS = [
  { label: "Drill Machines", href: "/products?search=drill+machines" },
  { label: "Paint",          href: "/products?search=paint" },
  { label: "Lighting",       href: "/products?search=lighting" },
  { label: "Furniture",      href: "/furniture" },
  { label: "Plumbing",       href: "/plumbing" },
];

const ALL_CATEGORIES = [
  { label: "Materials",   href: "/materials",   emoji: "🏗️" },
  { label: "Tools",       href: "/tools",       emoji: "🔧" },
  { label: "Hardware",    href: "/hardware",    emoji: "🔩" },
  { label: "Paint",       href: "/paint",       emoji: "🎨" },
  { label: "Plumbing",    href: "/plumbing",    emoji: "🚿" },
  { label: "Furniture",   href: "/furniture",   emoji: "🪑" },
  { label: "Lighting",    href: "/lighting",    emoji: "💡" },
  { label: "Garden",      href: "/garden",      emoji: "🌿" },
  { label: "DIY Guides",  href: "/diy",         emoji: "📖" },
  { label: "Services",    href: "/services",    emoji: "🛠️" },
  { label: "All Products", href: "/products",   emoji: "🛒" },
];

function CategoryModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-4 top-20 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-primary">All Categories</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 max-h-[60vh] overflow-y-auto">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={onClose}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 border border-gray-100 hover:border-primary/20 transition-all duration-150 group cursor-pointer"
            >
              <span className="text-2xl leading-none">{cat.emoji}</span>
              <span className="text-[11px] font-semibold text-primary text-center leading-tight group-hover:text-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Hero() {
  const [showCategories, setShowCategories] = useState(false);

  function handleShopNow() {
    const input = document.querySelector("input[type='search'], input[placeholder*='Search']");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return (
    <section className="bg-gradient-to-br from-[#F9FAFB] via-white to-[#EEF3F8] py-8 md:py-16">

      {showCategories && <CategoryModal onClose={() => setShowCategories(false)} />}

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* ── Left: Text content ───────────────────────────────── */}
          <div className="flex flex-col gap-5 md:gap-7">

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Precision Engineering
            </p>

            {/* Heading */}
            <h1 className="text-[2.6rem] md:text-6xl font-bold text-primary leading-[1.12] tracking-tight">
              Everything You Need to{" "}
              <span className="text-accent">Build Better</span>{" "}
              Homes
            </h1>

            {/* Subtext */}
            <p className="text-[15px] text-muted leading-relaxed max-w-[420px]">
              Materials &bull; Tools &bull; Hardware &bull; DIY Solutions.{" "}
              Professional grade supplies for every blueprint.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleShopNow}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => setShowCategories(true)}
              >
                Explore Categories
              </Button>
            </div>

            {/* Trending tags */}
            <div className="flex flex-col gap-2.5 pt-1">
              <p className="text-xs font-medium text-muted">Trending now:</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className="px-3 py-1.5 text-xs font-medium text-primary/80 bg-white border border-gray-200 rounded-md hover:border-accent hover:text-accent transition-colors duration-150"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Image + floating card ─────────────────────── */}
          <div className="relative mt-4 md:mt-0">

            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-gray-100 group">
              <Image
                src="/hero-product.avif"
                alt="Professional grade power tools"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                priority
              />
            </div>

            {/* Floating card */}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3.5 min-w-[185px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted mb-2.5">
                Build Progress
              </p>
              <div className="h-1.5 w-full bg-gray-100 rounded-full mb-2">
                <div
                  className="h-1.5 bg-accent rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-sm font-semibold text-primary">
                65% Project Efficiency
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
