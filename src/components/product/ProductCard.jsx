"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function StarRating({ rating }) {
  const safe  = Number.isFinite(Number(rating)) && Number(rating) > 0
    ? Math.min(5, Math.max(0, Number(rating)))
    : 0;
  if (safe === 0) return null;
  const full  = Math.floor(safe);
  const half  = safe - full >= 0.5 && full < 5;
  const empty = Math.max(0, 5 - full - (half ? 1 : 0));
  const path  = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array(full).fill(0).map((_, i) => (
        <svg key={`f${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d={path}/></svg>
      ))}
      {half && (
        <svg key="h" className="h-3 w-3 text-amber-400" viewBox="0 0 20 20">
          <defs><linearGradient id="half-grad"><stop offset="50%" stopColor="#FBBF24"/><stop offset="50%" stopColor="#E5E7EB"/></linearGradient></defs>
          <path fill="url(#half-grad)" d={path}/>
        </svg>
      )}
      {Array(empty).fill(0).map((_, i) => (
        <svg key={`e${i}`} className="h-3 w-3 fill-gray-200 text-gray-200" viewBox="0 0 20 20"><path d={path}/></svg>
      ))}
    </span>
  );
}

const BADGE_STYLE = {
  "Best Seller": "bg-accent text-primary",
  "Featured":    "bg-primary text-accent",
  "New":         "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "Trending":    "bg-violet-600 text-white",
};

export default function ProductCard({ product }) {
  const { addToCart, updateQuantity, getQuantity } = useCart();
  const inCartQty = getQuantity(product.supplierProductId);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const price         = product.price ?? 0;
  const originalPrice = product.originalPrice ?? 0;
  const discount      = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const wishlisted = isWishlisted(product.id);
  const hasRating  = product.rating && Number(product.rating) > 0;
  const imageSrc   = product.image || `https://placehold.co/400x400/f8fafc/132028?text=${encodeURIComponent(product.name?.split(" ").slice(0, 3).join(" ") || "Product")}`;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg overflow-hidden cursor-pointer">
      {/* Full-card link */}
      <Link
        href={`/products/${product.slug ?? product.id}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10"
      />

      {/* Image area */}
      <div className="relative overflow-hidden bg-gray-50 flex-shrink-0">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
          {discount > 0 && (
            <span className="inline-flex items-center rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-sm ${BADGE_STYLE[product.badge] ?? "bg-primary text-white"}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-200 cursor-pointer ${
            wishlisted
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-gray-200 bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-3 w-3 transition-all ${wishlisted ? "fill-red-500" : ""}`} />
        </button>

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-gray-800/80 px-3 py-1 text-[10px] font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}

        <div className="flex aspect-square items-center justify-center p-4">
          <Image
            src={imageSrc}
            alt={product.name}
            width={200}
            height={200}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Brand chip */}
        {product.brand && (
          <span className="w-fit rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary/60 capitalize leading-tight">
            {product.brand}
          </span>
        )}

        {/* Name */}
        <h2 className="pointer-events-none relative z-20 text-[13px] font-semibold leading-snug text-gray-800 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h2>

        {/* Rating — only shown when present */}
        {hasRating && (
          <div className="pointer-events-none relative z-20 flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-[11px] font-semibold text-gray-700">{product.rating}</span>
            {product.reviewsCount > 0 && (
              <span className="text-[11px] text-gray-400">({product.reviewsCount.toLocaleString("en-IN")})</span>
            )}
          </div>
        )}

        {/* Price block */}
        <div className="pointer-events-none relative z-20 mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium text-gray-500 leading-none">₹</span>
            <span className="text-base font-bold leading-none text-gray-900">
              {price.toLocaleString("en-IN")}
            </span>
            {originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.inStock && (
            <div className="mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-700 font-medium">In stock</span>
            </div>
          )}
        </div>

        {/* Add to Cart — becomes a quantity stepper once the item is in the cart */}
        {inCartQty > 0 ? (
          <div className="relative z-30 mt-1 flex w-full items-center justify-between rounded-xl border border-accent bg-accent/10 px-1 py-0.5">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); updateQuantity(product.supplierProductId, inCartQty - 1); }}
              className="flex h-7 w-8 cursor-pointer items-center justify-center rounded-lg text-primary transition hover:bg-accent/30 active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-[12px] font-bold text-primary">{inCartQty} in cart</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); updateQuantity(product.supplierProductId, inCartQty + 1); }}
              className="flex h-7 w-8 cursor-pointer items-center justify-center rounded-lg text-primary transition hover:bg-accent/30 active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // CartContext toasts success/failure itself.
              if (product.inStock) addToCart(product, 1);
            }}
            disabled={!product.inStock}
            className="relative z-30 mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-[12px] font-bold text-primary transition-all duration-150 hover:bg-accent/90 hover:shadow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
