"use client";

// ─── Base shimmer ───────────────────────────────────────────────────────────────

/**
 * Shimmer skeleton base.
 * Accepts any className for size/shape — caller controls everything else.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32 rounded-md" />
 */
export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-md ${className}`}
      style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
    />
  );
}

// ─── Product card skeleton ──────────────────────────────────────────────────────

/**
 * Matches the height/layout of ProductCard.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Category */}
        <Skeleton className="h-3 w-20" />
        {/* Name */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        {/* Rating */}
        <Skeleton className="h-3 w-28" />
        {/* Price + button row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of N ProductCardSkeleton placeholders.
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Order card skeleton ────────────────────────────────────────────────────────

export function OrderCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full max-w-xs" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

/**
 * Stack of N OrderCardSkeleton placeholders.
 */
export function OrderListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Order detail skeleton ──────────────────────────────────────────────────────

export function OrderDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Tracking card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
              <div className="flex-1 pt-1.5 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
        {/* Items card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <Skeleton className="h-5 w-28" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full max-w-xs" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
      {/* Right column */}
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Notification skeleton ──────────────────────────────────────────────────────

export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
      <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Service card skeleton ──────────────────────────────────────────────────────

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 p-5 pb-4">
        <Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <div className="h-px bg-gray-100 mx-5" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Profile header skeleton ────────────────────────────────────────────────────

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page header skeleton ───────────────────────────────────────────────────────

export function PageHeaderSkeleton({ withSubtitle = true }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-56" />
      {withSubtitle && <Skeleton className="h-4 w-36" />}
    </div>
  );
}

// ─── DIY guide card skeleton ────────────────────────────────────────────────────

export function GuideCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="h-1.5 w-full bg-gray-200" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-5 w-16 rounded-md" />)}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function GuideGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <GuideCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Generic list skeleton ──────────────────────────────────────────────────────

/**
 * Renders N rows of shimmer lines — useful for any text list.
 */
export function ListSkeleton({ rows = 4, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className={`h-4 ${i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-full" : "w-5/6"}`} />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
