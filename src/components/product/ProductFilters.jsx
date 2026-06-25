"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

// ─── Filter group data ────────────────────────────────────────────────────────

const PRICE_OPTIONS = [
  { value: "all", label: "All prices" },
  { value: "low", label: "Under ₹500" },
  { value: "mid", label: "₹500 – ₹2,000" },
  { value: "high", label: "Above ₹2,000" },
];

const RATING_OPTIONS = [
  { value: "all",  label: "All ratings" },
  { value: "4",    label: "4★ & above",  stars: 4 },
  { value: "3",    label: "3★ & above",  stars: 3 },
];

const AVAILABILITY_OPTIONS = [
  { value: "all",     label: "All products" },
  { value: "inStock", label: "In stock only" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MiniStars({ count }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array(5).fill(0).map((_, i) => (
        <svg key={i} className={`h-2.5 w-2.5 ${i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between py-3 text-left cursor-pointer group"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-primary transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function RadioOption({ name, value, label, checked, onChange, extra }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
      checked ? "bg-primary/5" : "hover:bg-gray-50"
    }`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {/* Custom radio ring */}
      <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked ? "border-primary bg-primary" : "border-gray-300 bg-white"
      }`}>
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className={`flex flex-1 items-center gap-1.5 text-[13px] ${checked ? "font-semibold text-primary" : "font-medium text-gray-700"}`}>
        {label}
        {extra}
      </span>
    </label>
  );
}

// ─── Active filter count ──────────────────────────────────────────────────────

function countActiveFilters(filters) {
  let n = 0;
  if (filters.priceRange !== "all") n++;
  if (filters.ratings !== "all") n++;
  if (filters.availability !== "all") n++;
  return n;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductFilters({
  filters,
  onChange,
  showHeader = true,
  className = "",
}) {
  const activeCount = countActiveFilters(filters);

  const clearFilters = () => {
    onChange("priceRange", "all");
    onChange("ratings", "all");
    onChange("availability", "all");
  };

  return (
    <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-primary">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="px-4">
        {/* Price */}
        <FilterGroup title="Price Range">
          <div className="space-y-0.5">
            {PRICE_OPTIONS.map((opt) => (
              <RadioOption
                key={opt.value}
                name="priceRange"
                value={opt.value}
                label={opt.label}
                checked={filters.priceRange === opt.value}
                onChange={(v) => onChange("priceRange", v)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Rating */}
        <FilterGroup title="Customer Rating">
          <div className="space-y-0.5">
            {RATING_OPTIONS.map((opt) => (
              <RadioOption
                key={opt.value}
                name="ratings"
                value={opt.value}
                label={opt.label}
                checked={filters.ratings === opt.value}
                onChange={(v) => onChange("ratings", v)}
                extra={opt.stars ? <MiniStars count={opt.stars} /> : null}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Availability */}
        <FilterGroup title="Availability">
          <div className="space-y-0.5">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <RadioOption
                key={opt.value}
                name="availability"
                value={opt.value}
                label={opt.label}
                checked={filters.availability === opt.value}
                onChange={(v) => onChange("availability", v)}
              />
            ))}
          </div>
        </FilterGroup>
      </div>
    </div>
  );
}
