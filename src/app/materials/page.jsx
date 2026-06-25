"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, HardHat } from "lucide-react";
import { MATERIALS_CATEGORIES } from "@/lib/materialsCategories";
import Footer from "@/components/layout/Footer";

const QUICK_LINKS = [
  { label: "Cement",        slug: "cement" },
  { label: "TMT Bars",      slug: "tmt-steel" },
  { label: "Bricks",        slug: "bricks-blocks" },
  { label: "Sand & Stone",  slug: "sand-aggregates" },
  { label: "Tiles",         slug: "tiles" },
  { label: "Waterproofing", slug: "waterproofing" },
];

const FEATURED = [
  {
    slug: "cement",
    headline: "Foundation First",
    sub: "OPC 53 & PPC cement from UltraTech, ACC, Ambuja & Dalmia",
    cta: "Shop Cement",
  },
  {
    slug: "tmt-steel",
    headline: "Steel That Lasts",
    sub: "TATA Tiscon, SAIL & Jindal TMT bars Fe500D & Fe550",
    cta: "Shop TMT Bars",
  },
  {
    slug: "tiles",
    headline: "Floor to Perfection",
    sub: "Kajaria, Somany & RAK vitrified, ceramic & wall tiles",
    cta: "Shop Tiles",
  },
];

export default function MaterialsPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col bg-[#EAEDED]">
      {/* Hero */}
      <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            BuildBudy Materials
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Construction Materials
          </h1>
          <p className="mt-3 text-base text-white/60">
            Cement, TMT bars, bricks, sand, tiles, waterproofing and more — everything to build with confidence.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-7 flex max-w-xl overflow-hidden rounded-lg shadow-lg"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cement, TMT bars, tiles, sand…"
              className="flex-1 bg-white px-4 py-3.5 text-sm text-primary outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-accent px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-accent/90"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/materials/${slug}`}
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
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-[#007185] transition hover:text-[#C45500]"
          >
            All products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {MATERIALS_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/materials/${cat.slug}`}
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <div
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: cat.iconBg }}
              >
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
              <div
                key={f.slug}
                className="flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-6"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    Featured
                  </p>
                  <h3 className="mt-1 text-base font-bold text-white">{f.headline}</h3>
                  <p className="mt-1 text-sm text-white/60">{f.sub}</p>
                </div>
                <Link
                  href={`/materials/${f.slug}`}
                  className="mt-4 inline-flex items-center gap-2 self-start rounded-lg bg-accent px-4 py-2 text-xs font-bold text-primary transition hover:bg-accent/90"
                >
                  <HardHat className="h-3.5 w-3.5" />
                  {f.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Promo banner */}
        <div className="mt-8 overflow-hidden rounded-xl bg-primary px-6 py-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Bulk Orders
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Save More When You Build More
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Get up to 12% off on bulk orders of cement, TMT bars & aggregates. Free delivery above ₹999.
            </p>
          </div>
          <Link
            href="/materials/cement"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-accent/90 sm:mt-0 sm:flex-shrink-0"
          >
            <HardHat className="h-4 w-4" />
            Shop Cement
          </Link>
        </div>

        {/* Trusted Brands */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">
            Trusted Brands
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "UltraTech", "ACC", "Ambuja", "Dalmia", "Shree Cement",
              "TATA Tiscon", "SAIL", "Jindal Steel", "JSW Steel", "Kamdhenu",
              "Kajaria", "Somany", "RAK Ceramics", "Johnson Tiles", "Nitco",
              "Pidilite", "Dr. Fixit", "Asian Paints Smartcare", "Birla White", "JK White",
            ].map((brand) => (
              <span
                key={brand}
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary"
              >
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
