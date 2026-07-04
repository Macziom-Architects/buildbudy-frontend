"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, TrendingUp, Tag, X, ChevronRight } from "lucide-react";
import { searchCatalog } from "@/lib/api/products";

const TRENDING = [
  "OPC Cement",
  "TMT Bars",
  "Power Drill",
  "Wall Paint",
  "LED Lights",
  "Pipe Wrench",
  "Safety Gloves",
];

const CATEGORIES = [
  { label: "Materials",  href: "/materials",  emoji: "🏗️" },
  { label: "Tools",      href: "/tools",      emoji: "🔧" },
  { label: "Hardware",   href: "/hardware",   emoji: "🔩" },
  { label: "Paint",      href: "/paint",      emoji: "🎨" },
  { label: "Plumbing",   href: "/plumbing",   emoji: "🚿" },
  { label: "Furniture",  href: "/furniture",  emoji: "🪑" },
  { label: "Lighting",   href: "/lighting",   emoji: "💡" },
  { label: "Garden",     href: "/garden",     emoji: "🌿" },
  { label: "DIY Guides", href: "/diy",        emoji: "📖" },
  { label: "Services",   href: "/services",   emoji: "🛠️" },
];

const STORAGE_KEY = "bb_recent_searches";
const MAX_RECENT = 6;

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function persistRecent(term) {
  try {
    const list = loadRecent().filter((s) => s.toLowerCase() !== term.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify([term, ...list].slice(0, MAX_RECENT)));
  } catch {}
}

function clearAllRecent() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

function removeOneRecent(term) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadRecent().filter((s) => s !== term)));
  } catch {}
}

export default function SearchBar({
  className = "",
  inputClassName = "",
  placeholder = "Search for tools, paint, plumbing...",
  variant = "light",
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const isDark = variant === "dark";
  const q = query.trim().toLowerCase();
  const hasQ = q.length >= 2;

  // Live product suggestions from the search API (debounced). searchCatalog
  // falls back to the mock catalog when no backend is configured.
  const [productHits, setProductHits] = useState([]);
  useEffect(() => {
    if (!hasQ) {
      setProductHits([]);
      return;
    }
    const t = setTimeout(() => {
      searchCatalog(q, { limit: 5 })
        .then((res) => setProductHits((res.products ?? []).slice(0, 5)))
        .catch(() => setProductHits([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, hasQ]);

  const categoryHits = useMemo(() => {
    if (!hasQ) return [];
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 3);
  }, [q, hasQ]);

  const noResults = hasQ && productHits.length === 0 && categoryHits.length === 0;

  const allItems = useMemo(() => {
    if (!hasQ) {
      return [
        ...recent.map((v) => ({ type: "recent", value: v })),
        ...TRENDING.slice(0, 6).map((v) => ({ type: "trending", value: v })),
      ];
    }
    return [
      ...categoryHits.map((c) => ({ type: "category", ...c })),
      ...productHits.map((p) => ({ type: "product", ...p })),
    ];
  }, [hasQ, recent, categoryHits, productHits]);

  const openDropdown = useCallback(() => {
    setRecent(loadRecent());
    setOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIdx(-1);
  }, []);

  const navigate = useCallback(
    (item) => {
      if (item.type === "category") {
        closeDropdown();
        router.push(item.href);
      } else if (item.type === "product") {
        persistRecent(item.name);
        closeDropdown();
        router.push(`/products/${item.slug ?? item.id}`);
      } else {
        persistRecent(item.value);
        closeDropdown();
        router.push(`/products?search=${encodeURIComponent(item.value)}`);
      }
    },
    [router, closeDropdown]
  );

  const submitSearch = useCallback(
    (term) => {
      const t = (term ?? query).trim();
      if (!t) return;
      persistRecent(t);
      closeDropdown();
      router.push(`/products?search=${encodeURIComponent(t)}`);
    },
    [query, router, closeDropdown]
  );

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === "Enter") { submitSearch(); }
      return;
    }
    if (e.key === "Escape") { closeDropdown(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < allItems.length) {
        navigate(allItems[activeIdx]);
      } else {
        submitSearch();
      }
    }
  }

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDropdown]);

  const showRecent = !hasQ && recent.length > 0;
  const showTrending = !hasQ;
  const showDropdown = open && (hasQ || showRecent || showTrending);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative group">
        <Search
          className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none transition-colors ${
            isDark
              ? "text-white/35 group-focus-within:text-muted"
              : "text-muted group-focus-within:text-primary"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          suppressHydrationWarning
          autoComplete="off"
          spellCheck="false"
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          className={
            inputClassName ||
            `w-full h-10 pl-9 pr-9 text-sm rounded-md transition-colors focus:outline-none ${
              isDark
                ? "bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white focus:text-primary focus:placeholder:text-muted focus:border-accent/50"
                : "bg-white border border-gray-200 text-primary placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30"
            }`
          }
        />
        {query && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setQuery("");
              setActiveIdx(-1);
              inputRef.current?.focus();
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
              isDark ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-primary"
            }`}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">

          {/* ── No results ─────────────────────────────────────────── */}
          {noResults && (
            <div className="px-4 py-7 text-center">
              <Search className="h-8 w-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm font-semibold text-primary">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-muted mt-1 mb-4">Try a different term</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {TRENDING.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onMouseDown={(e) => { e.preventDefault(); submitSearch(t); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-primary hover:border-accent hover:bg-accent/10 transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Category matches ───────────────────────────────────── */}
          {categoryHits.length > 0 && (
            <div>
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Categories
                </p>
              </div>
              {categoryHits.map((cat, idx) => (
                <button
                  key={cat.label}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); navigate({ type: "category", ...cat }); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    activeIdx === idx ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-primary flex-1">{cat.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* ── Product matches ────────────────────────────────────── */}
          {productHits.length > 0 && (
            <div>
              {categoryHits.length > 0 && <div className="h-px bg-gray-100 mx-3" />}
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
                  <Search className="h-3 w-3" /> Products
                </p>
              </div>
              {productHits.map((product, idx) => {
                const itemIdx = categoryHits.length + idx;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); navigate({ type: "product", ...product }); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      activeIdx === itemIdx ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {product.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                      <p className="text-xs text-muted">
                        ₹{Number(product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); submitSearch(); }}
                className="w-full flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-semibold text-accent border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                View all results for &ldquo;{query}&rdquo;
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* ── Recent searches ────────────────────────────────────── */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Recent
                </p>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearAllRecent();
                    setRecent([]);
                  }}
                  className="text-[10px] text-muted hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              {recent.map((term, idx) => (
                <div
                  key={term}
                  className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                    activeIdx === idx ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <button
                    type="button"
                    className="flex-1 text-sm text-primary text-left cursor-pointer"
                    onMouseDown={(e) => { e.preventDefault(); submitSearch(term); }}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      removeOneRecent(term);
                      setRecent((p) => p.filter((s) => s !== term));
                    }}
                    className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                    aria-label={`Remove ${term}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Trending searches ──────────────────────────────────── */}
          {showTrending && (
            <div>
              {showRecent && <div className="h-px bg-gray-100 mx-3 mt-1" />}
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Trending
                </p>
              </div>
              <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                {TRENDING.map((term, idx) => {
                  const itemIdx = recent.length + idx;
                  return (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); submitSearch(term); }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        activeIdx === itemIdx
                          ? "border-accent bg-accent/10 text-primary"
                          : "border-gray-200 text-primary hover:border-accent hover:bg-accent/10"
                      }`}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
