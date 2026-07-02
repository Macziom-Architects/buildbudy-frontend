"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const BADGE_COLORS = {
  "Best Seller": "bg-accent text-primary",
  "New":         "bg-emerald-500 text-white",
  "20% Off":     "bg-red-500 text-white",
};

function StarRating({ rating, reviewCount }) {
  const safe   = Number.isFinite(Number(rating)) ? Math.min(5, Math.max(0, Number(rating))) : 0;
  const filled = Math.round(safe);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`h-3.5 w-3.5 ${
              n <= filled
                ? "fill-accent stroke-accent"
                : "fill-gray-100 stroke-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted">
        {rating} ({reviewCount})
      </span>
    </div>
  );
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  badge,
  href = "#",
  className = "",
}) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart({ id, name, price, image }, 1);
  }

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">

          {/* Badge */}
          {badge && (
            <span
              className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                BADGE_COLORS[badge] ?? "bg-primary text-white"
              }`}
            >
              {badge}
            </span>
          )}

          {/* Product image — zooms on card hover */}
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5">

        {/* Name */}
        <Link href={href}>
          <h3 className="text-sm font-bold text-primary leading-snug line-clamp-2 hover:text-accent transition-colors duration-150">
            {name}
          </h3>
        </Link>

        {/* Star rating */}
        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary">
            ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {originalPrice && (
            <span className="text-xs text-muted line-through">
              ₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-0.5 w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>

      </div>
    </div>
  );
}
