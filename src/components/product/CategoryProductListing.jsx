"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Home, X,
  SlidersHorizontal, ArrowUpDown, Search,
} from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/api/products";

const PRODUCTS_PER_PAGE = 12;
const DEFAULT_FILTERS = { priceRange: "all", ratings: "all", availability: "all" };

const SORT_OPTIONS = [
  { value: "popularity",      label: "Popularity" },
  { value: "priceLowToHigh",  label: "Price: Low to High" },
  { value: "priceHighToLow",  label: "Price: High to Low" },
  { value: "ratingHighToLow", label: "Rating: High to Low" },
];

function activeFilterCount(f) {
  return Object.values(f).filter((v) => v !== "all").length;
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, "…a", totalPages];
  if (currentPage >= totalPages - 2) return [1, "…b", totalPages - 2, totalPages - 1, totalPages];
  return [1, "…c", currentPage, "…d", totalPages];
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const items = getPaginationItems(currentPage, totalPages);
  return (
    <nav aria-label="Product pages" className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {items.map((item, idx) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => setCurrentPage(item)}
            className={`h-9 min-w-9 rounded-xl px-3 text-sm font-bold shadow-sm transition cursor-pointer ${
              item === currentPage
                ? "bg-primary text-accent shadow-md"
                : "border border-gray-200 bg-white text-primary hover:border-primary hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item + idx} className="flex h-9 w-8 items-center justify-center text-sm text-gray-400">
            ···
          </span>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function matchFilters(product, filters) {
  const { priceRange, ratings, availability } = filters;
  if (priceRange === "low"  && product.price >= 500)                return false;
  if (priceRange === "mid"  && (product.price < 500 || product.price > 2000)) return false;
  if (priceRange === "high" && product.price <= 2000)               return false;
  if (ratings !== "all"     && product.rating < Number(ratings))    return false;
  if (availability === "inStock" && !product.inStock)               return false;
  return true;
}

/**
 * @param {{ slug: string, categories: Array, filterFn: Function, basePath: string, sectionLabel: string }} props
 */
export default function CategoryProductListing({
  slug,
  categories,
  filterFn,
  basePath,
  sectionLabel,
}) {
  const sectionName    = basePath.replace("/", "");
  const sectionNameCap = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

  const category     = categories.find((c) => c.slug === slug) ?? null;
  const baseProducts = filterFn(getProducts(), slug);
  const categoryLabel = category?.label ?? slug.replace(/-/g, " ");

  const [sortOption, setSortOption]         = useState("popularity");
  const [filters, setFilters]               = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters]     = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [pageState, setPageState]           = useState({ key: "", page: 1 });

  const openFilterDrawer   = () => { setDraftFilters(filters); setIsFilterOpen(true); };
  const applyMobileFilters = () => { setFilters(draftFilters); setIsFilterOpen(false); };

  const sorted = [...baseProducts.filter((p) => matchFilters(p, filters))].sort((a, b) => {
    if (sortOption === "priceLowToHigh")  return a.price - b.price;
    if (sortOption === "priceHighToLow")  return b.price - a.price;
    if (sortOption === "ratingHighToLow") return b.rating - a.rating;
    return 0;
  });

  const paginationKey = [slug, filters.priceRange, filters.ratings, filters.availability, sortOption].join("|");
  const currentPage   = pageState.key === paginationKey ? pageState.page : 1;
  const setCurrentPage = (fn) => {
    setPageState((prev) => {
      const prevPage = prev.key === paginationKey ? prev.page : 1;
      const page = typeof fn === "function" ? fn(prevPage) : fn;
      return { key: paginationKey, page };
    });
  };

  const totalPages      = Math.max(1, Math.ceil(sorted.length / PRODUCTS_PER_PAGE));
  const paginated       = sorted.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const filterCount     = activeFilterCount(filters);
  const draftFilterCount = activeFilterCount(draftFilters);
  const sortSelectId    = `${sectionName}-sort`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8]">

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1400px] items-center gap-1.5 py-2.5 text-xs text-muted">
          <Link href="/" className="flex items-center gap-1 transition hover:text-primary">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <Link href={basePath} className="transition hover:text-primary capitalize">
            {sectionNameCap}
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <span className="font-semibold capitalize text-primary">{categoryLabel}</span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3.5">
            {category && (
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm"
                style={{ backgroundColor: category.iconBg }}
              >
                {category.icon}
              </div>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent/80">
                {sectionLabel}
              </p>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-primary sm:text-2xl">
                {categoryLabel}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {sorted.length} product{sorted.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Sort — desktop */}
          <div className="hidden items-center gap-2 lg:flex">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <label htmlFor={sortSelectId} className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              Sort by
            </label>
            <select
              id={sortSelectId}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-9 rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-sm font-medium text-primary shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[248px_1fr]">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">

              {/* Category nav card */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {sectionNameCap} Categories
                  </p>
                </div>
                <ul className="px-2 py-2 space-y-0.5">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`${basePath}/${cat.slug}`}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                          cat.slug === slug
                            ? "bg-primary text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        }`}
                      >
                        <span className="text-base leading-none">{cat.icon}</span>
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <ProductFilters
                filters={filters}
                onChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
              />
            </div>
          </aside>

          {/* Products column */}
          <section>
            {/* Mobile toolbar */}
            <div className="mb-4 flex items-center gap-2.5 lg:hidden">
              <button
                type="button"
                onClick={openFilterDrawer}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {filterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
                    {filterCount}
                  </span>
                )}
              </button>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white pl-3 pr-7 text-sm font-medium text-primary shadow-sm outline-none focus:border-primary cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {sorted.length > 0 ? (
              <>
                {/* Results summary */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs text-muted">
                    Showing{" "}
                    <span className="font-semibold text-primary">
                      {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, sorted.length)}
                    </span>{" "}
                    of <span className="font-semibold text-primary">{sorted.length}</span> results
                  </p>
                  {filterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" /> Clear filters
                    </button>
                  )}
                </div>

                <ProductGrid products={paginated} />

                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                    <p className="mt-3 text-center text-xs text-muted">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-primary">No products found</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                  No products match your current filters. Try clearing them or browsing another category.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-gray-50 cursor-pointer"
                  >
                    Clear filters
                  </button>
                  <Link
                    href={basePath}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-gray-50"
                  >
                    Browse all categories
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* ── Mobile filter backdrop ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isFilterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsFilterOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile filter drawer ───────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-mobile-filters-title"
        className={`fixed bottom-0 left-0 z-50 h-[85vh] w-full rounded-t-2xl bg-white shadow-2xl transition duration-300 lg:hidden ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h2 id="cat-mobile-filters-title" className="text-base font-bold text-primary">
              Filter Products
              {draftFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-primary">
                  {draftFilterCount} active
                </span>
              )}
            </h2>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setIsFilterOpen(false)}
              className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Category pills */}
            <div className="mb-5">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`${basePath}/${cat.slug}`}
                    onClick={() => setIsFilterOpen(false)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      cat.slug === slug
                        ? "bg-primary text-white"
                        : "border border-gray-200 bg-white text-primary hover:border-accent"
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            <ProductFilters
              filters={draftFilters}
              onChange={(k, v) => setDraftFilters((prev) => ({ ...prev, [k]: v }))}
              showHeader={false}
              className="border-0 p-0 shadow-none rounded-none"
            />
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-5 py-4">
            <button
              type="button"
              onClick={() => setDraftFilters(DEFAULT_FILTERS)}
              className="h-11 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-primary transition hover:border-primary cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={applyMobileFilters}
              className="h-11 flex-1 rounded-xl bg-primary text-sm font-bold text-white transition hover:bg-primary/90 cursor-pointer"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
