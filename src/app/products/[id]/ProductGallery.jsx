"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

export default function ProductGallery({ product, galleryImages }) {
  const [selected, setSelected] = useState(product.image);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ─────────────────────────────────────────────── */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
        <div className="flex aspect-square items-center justify-center p-8 sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
          <Image
            src={selected}
            alt={product.name}
            width={560}
            height={560}
            priority
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-gray-500 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="h-3 w-3" />
          Hover to zoom
        </div>

        {/* In/out of stock ribbon */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-gray-900/80 px-4 py-1.5 text-sm font-semibold text-white shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Thumbnails ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        {galleryImages.map((img, index) => {
          const isActive = selected === img;
          return (
            <button
              key={`${img}-${index}`}
              type="button"
              aria-label={`${product.name} — view ${index + 1}`}
              aria-pressed={isActive}
              onClick={() => setSelected(img)}
              className={`group/thumb relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-gray-50 p-2 transition-all duration-200 focus:outline-none ${
                isActive
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} view ${index + 1}`}
                width={120}
                height={120}
                className="h-full w-full object-contain transition-transform duration-300 group-hover/thumb:scale-110"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
