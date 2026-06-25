"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Lightbulb } from "lucide-react";
import { LIGHTING_CATEGORIES } from "@/lib/lightingCategories";
import Footer from "@/components/layout/Footer";

const QUICK_LINKS = [
  { label: "Ceiling Lights", slug: "ceiling-lights" },
  { label: "LED Bulbs",      slug: "led-bulbs" },
  { label: "Outdoor",        slug: "outdoor" },
  { label: "Smart Lights",   slug: "smart-lights" },
  { label: "Decorative",     slug: "decorative" },
  { label: "Strip Lights",   slug: "strip-lights" },
];

const FEATURED = [
  {
    slug: "led-bulbs",
    headline: "Energy-Efficient LEDs",
    sub: "Cut electricity bills by up to 80% with quality LED bulbs",
    cta: "Shop LED Bulbs",
  },
  {
    slug: "smart-lights",
    headline: "Smart Home Lighting",
    sub: "Wi-Fi bulbs with Alexa & Google Home compatibility",
    cta: "Shop Smart Lights",
  },
  {
    slug: "outdoor",
    headline: "Outdoor Solutions",
    sub: "Weatherproof floodlights, wall packs & solar lighting",
    cta: "Shop Outdoor Lighting",
  },
];

const BRANDS = [
  "Philips", "Syska", "Havells", "Crompton",
  "Wipro", "Orient", "Bajaj", "Surya",
  "Anchor", "Legrand", "GM", "Polycab",
];

export default function LightingPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col bg-[#F5F6F8]">
      {/* Hero */}
      <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            BuildBudy Lighting
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Lights for Every Space
          </h1>
          <p className="mt-3 text-base text-white/60">
            LED bulbs, ceiling lights, smart lighting, outdoor and decorative lamps from top brands.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-7 flex max-w-xl overflow-hidden rounded-xl shadow-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search LED bulbs, panel lights, smart lights…"
              className="flex-1 bg-white px-4 py-3.5 text-sm text-primary outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="flex items-center gap-2 bg-accent px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-accent/90">
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/lighting/${slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Category grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Shop by Category</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-muted transition hover:text-primary">
            All products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {LIGHTING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/lighting/${cat.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md cursor-pointer"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: cat.iconBg }}>
                {cat.icon}
              </div>
              <p className="text-sm font-bold leading-snug text-primary">{cat.label}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted">{cat.description}</p>
            </Link>
          ))}
        </div>

        {/* Featured collections */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-primary">Featured Collections</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED.map((f) => (
              <div key={f.slug} className="flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Featured</p>
                  <h3 className="mt-1 text-base font-bold text-white">{f.headline}</h3>
                  <p className="mt-1 text-sm text-white/60">{f.sub}</p>
                </div>
                <Link
                  href={`/lighting/${f.slug}`}
                  className="mt-4 inline-flex items-center gap-2 self-start rounded-xl bg-accent px-4 py-2 text-xs font-bold text-primary transition hover:bg-accent/90"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {f.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Promo banner */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-primary px-6 py-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Limited Time Offer</p>
            <h3 className="mt-1 text-xl font-bold text-white">20% Off Philips & Syska LEDs</h3>
            <p className="mt-1 text-sm text-white/60">3-year warranty. BEE 5-star rated. Delivered in 2 days.</p>
          </div>
          <Link
            href="/lighting/led-bulbs"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-accent/90 sm:mt-0 sm:flex-shrink-0"
          >
            <Lightbulb className="h-4 w-4" />
            Shop LED Bulbs
          </Link>
        </div>

        {/* Brands */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Trusted Brands</p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <span key={brand} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
