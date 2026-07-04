"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { getProductById } from "@/lib/api/products";

const KEY = "bb_recently_viewed";
const MAX_STORED = 8;

export default function RecentlyViewed({ currentProductId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Read stored IDs
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch {}

    // Prepend current, dedupe, cap
    const updated = [currentProductId, ...stored.filter((id) => id !== currentProductId)].slice(0, MAX_STORED);
    localStorage.setItem(KEY, JSON.stringify(updated));

    // Show previous ones (not current)
    const toShow = updated.slice(1, 5);
    setProducts(toShow.map((id) => getProductById(id)).filter(Boolean));
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-10 md:mt-14">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">Recently Viewed</h2>
        <Link
          href="/products"
          className="text-xs font-semibold text-muted hover:text-primary transition-colors"
        >
          Browse all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {products.map((item) => {
          const originalPrice = item.originalPrice ?? 0;
          const discount =
            originalPrice > item.price
              ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
              : 0;

          return (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-50">
                {discount > 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    -{discount}%
                  </span>
                )}
                <div className="flex aspect-square items-center justify-center p-5">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                <span className="text-[10px] font-semibold capitalize text-primary/60">
                  {item.category?.replaceAll("-", " ")}
                </span>
                <h3 className="text-[13px] font-semibold leading-snug text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <div className="mt-auto flex items-baseline gap-1.5 pt-1">
                  <span className="text-base font-bold text-primary">
                    ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {originalPrice > item.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
