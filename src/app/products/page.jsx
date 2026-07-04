"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, X, SlidersHorizontal,
  ArrowUpDown, Search, Home,
} from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import { fetchProducts, searchCatalog } from "@/lib/api/products";
import Footer from "@/components/layout/Footer";

const POPULAR_SEARCHES = ["screw", "cement", "drill", "paint", "pipe", "handle", "tile"];
const PRODUCTS_PER_PAGE = 12;
const DEFAULT_FILTERS = { priceRange: "all", ratings: "all", availability: "all" };

const SORT_OPTIONS = [
  { value: "popularity",      label: "Popularity" },
  { value: "priceLowToHigh",  label: "Price: Low to High" },
  { value: "priceHighToLow",  label: "Price: High to Low" },
  { value: "ratingHighToLow", label: "Rating: High to Low" },
];

function activeFilterCount(filters) {
  return Object.values(filters).filter((v) => v !== "all").length;
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

function ProductsContent() {
  const searchParams   = useSearchParams();
  const searchQuery    = searchParams.get("search")?.trim() || "";
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState(null);
  const [pageState, setPageState]   = useState({ key: "", page: 1 });
  const [sortOption, setSortOption] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters]           = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let active = true;
    setLoading(true);
    // A search query goes through the OpenSearch endpoint (whole catalog,
    // fuzzy-ranked); plain browsing pulls the product listing.
    const fetcher = searchQuery
      ? searchCatalog(searchQuery, { limit: 60 })
      : fetchProducts();
    fetcher
      .then((res) => { if (active) setProducts(res.products ?? []); })
      .catch((err) => { if (active) setLoadError(err); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchQuery]);

  const handleFilterChange      = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const handleDraftFilterChange = (k, v) => setDraftFilters((p) => ({ ...p, [k]: v }));
  const openFilterDrawer  = () => { setDraftFilters(filters); setIsFilterOpen(true); };
  const applyMobileFilters = () => { setFilters(draftFilters); setIsFilterOpen(false); };

  const normalizedQuery = searchQuery.toLowerCase();

  const matchesFilters = (p) => {
    const price = p.price;
    if (filters.priceRange === "low"  && price >= 500)                return false;
    if (filters.priceRange === "mid"  && (price < 500 || price > 2000)) return false;
    if (filters.priceRange === "high" && price <= 2000)               return false;
    if (filters.ratings !== "all" && p.rating < Number(filters.ratings)) return false;
    if (filters.availability === "inStock" && !p.inStock)             return false;
    return true;
  };

  const matchesSearch = (p) =>
    !normalizedQuery ||
    [p.name, p.category].filter(Boolean).some((v) => v.toLowerCase().includes(normalizedQuery));

  const eligible     = products.filter(matchesFilters);
  const direct       = eligible.filter(matchesSearch);
  const similar      = eligible.filter((p) => !direct.some((d) => d.id === p.id) && direct.some((d) => d.category === p.category));
  const remaining    = eligible.filter((p) => !direct.some((d) => d.id === p.id) && !similar.some((s) => s.id === p.id));
  const filtered     = normalizedQuery && direct.length > 0 && direct.length < 12
    ? [...direct, ...similar, ...remaining]
    : direct;

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "priceLowToHigh")  return a.price - b.price;
    if (sortOption === "priceHighToLow")  return b.price - a.price;
    if (sortOption === "ratingHighToLow") return b.rating - a.rating;
    return 0;
  });

  const paginationKey = [searchQuery, filters.priceRange, filters.ratings, filters.availability, sortOption].join("|");
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

  if (loading) return <ProductsFallback />;

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F5F6F8] px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <Search className="h-7 w-7 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-primary">Couldn’t load products</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
          {loadError.message || "Something went wrong. Please try again."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-gray-50 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8]">

      {/* ── Breadcrumb bar ─────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1400px] items-center gap-1.5 py-2.5 text-xs text-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <span className="font-semibold text-primary">
            {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
          </span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent/80">
              BuildBudy Marketplace
            </p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-primary sm:text-2xl">
              {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {sorted.length === 0
                ? "No products found"
                : `${sorted.length.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} product${sorted.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {/* Sort — desktop */}
          <div className="hidden items-center gap-2 lg:flex">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <label htmlFor="products-sort" className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              Sort by
            </label>
            <select
              id="products-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-9 rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-sm font-medium text-primary shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Active filter chips ────────────────────────────────────────── */}
        {filterCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">Filters:</span>
            {filters.priceRange !== "all" && (
              <button
                type="button"
                onClick={() => handleFilterChange("priceRange", "all")}
                className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-accent/20 cursor-pointer"
              >
                {filters.priceRange === "low" ? "Under ₹500" : filters.priceRange === "mid" ? "₹500 – ₹2,000" : "Above ₹2,000"}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.ratings !== "all" && (
              <button
                type="button"
                onClick={() => handleFilterChange("ratings", "all")}
                className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-accent/20 cursor-pointer"
              >
                {filters.ratings}+ Stars
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.availability === "inStock" && (
              <button
                type="button"
                onClick={() => handleFilterChange("availability", "all")}
                className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-accent/20 cursor-pointer"
              >
                In Stock
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Body: sidebar + products ───────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[248px_1fr]">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onChange={handleFilterChange} />
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
                    Showing <span className="font-semibold text-primary">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, sorted.length)}</span> of{" "}
                    <span className="font-semibold text-primary">{sorted.length}</span> results
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
              /* Empty state */
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-primary">No products found</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different term or browse popular searches below.`
                    : "No products match your current filters. Try clearing them."}
                </p>
                {filterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-gray-50 cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <Link
                      key={term}
                      href={`/products?search=${term}`}
                      className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold capitalize text-primary transition hover:border-accent hover:bg-accent/10 cursor-pointer"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* ── Mobile filter drawer backdrop ──────────────────────────────── */}
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
        aria-labelledby="mobile-filters-title"
        className={`fixed bottom-0 left-0 z-50 w-full rounded-t-2xl bg-white shadow-2xl transition duration-300 ease-in-out lg:hidden ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80dvh" }}
      >
        <div className="flex h-full flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h2 id="mobile-filters-title" className="text-base font-bold text-primary">
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
            <ProductFilters
              filters={draftFilters}
              onChange={handleDraftFilterChange}
              showHeader={false}
              className="border-0 p-0 shadow-none"
            />
          </div>

          <div
            className="flex items-center gap-3 border-t border-gray-100 bg-white px-5 py-4"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
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

function ProductsFallback() {
  return (
    <div className="bg-[#F5F6F8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
              <div className="p-4 flex flex-col gap-2.5 flex-1">
                <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded-md animate-pulse mt-1" />
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-9 w-24 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
