"use client";

import { useState } from "react";
import {
  ShoppingCart, Zap, Minus, Plus, Heart, Share2,
  MapPin, Loader2, CheckCircle2, XCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function ProductActions({ product, priceText }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, showToast } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const router = useRouter();

  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null); // "available" | "unavailable" | null
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name.split(" ").slice(0, 3).join(" ")} added to cart`);
    router.push("/cart");
  };
  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(
      wishlisted ? "Removed from wishlist" : "Saved to wishlist",
      "success",
    );
  };

  async function checkPincode() {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    setPincodeStatus(null);
    await new Promise((r) => setTimeout(r, 700));
    // Deterministic mock: pincodes starting with 1-7 are serviceable
    setPincodeStatus(Number(pincode[0]) <= 7 ? "available" : "unavailable");
    setPincodeLoading(false);
  }

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: product.name, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      showToast("Link copied to clipboard");
    }
  }

  return (
    <>
      {/* ── Quantity + stock status ─────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={dec}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-gray-500 transition hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex h-10 w-10 select-none items-center justify-center border-x border-gray-200 text-sm font-bold text-primary">
            {quantity}
          </span>
          <button
            type="button"
            onClick={inc}
            aria-label="Increase quantity"
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-gray-500 transition hover:bg-gray-50 active:bg-gray-100"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className={`flex items-center gap-2 text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
          <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"} shadow-[0_0_0_3px] ${product.inStock ? "shadow-emerald-100" : "shadow-red-100"}`} />
          {product.inStock ? "In Stock — Ready to ship" : "Currently unavailable"}
        </div>
      </div>

      {/* ── Action buttons ──────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-primary shadow-sm transition hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
      </div>

      {/* ── Wishlist + Share ─────────────────────────────────────────── */}
      <div className="mt-2.5 flex gap-2.5">
        <button
          type="button"
          onClick={handleWishlist}
          className={`flex flex-1 h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition hover:shadow-sm active:scale-[0.98] ${
            wishlisted
              ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
              : "border-gray-200 bg-white text-primary hover:border-primary/30 hover:bg-gray-50"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500" : ""}`} />
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary/30 hover:bg-gray-50 hover:text-primary"
          aria-label="Share product"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* ── Pincode delivery checker ─────────────────────────────────── */}
      <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-primary">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          Check Delivery Availability
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ""));
              setPincodeStatus(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && checkPincode()}
            placeholder="Enter 6-digit pincode"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
          />
          <button
            type="button"
            onClick={checkPincode}
            disabled={pincode.length !== 6 || pincodeLoading}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {pincodeLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Check"}
          </button>
        </div>

        {pincodeStatus && (
          <div className={`mt-2.5 flex items-center gap-2 text-xs font-semibold ${
            pincodeStatus === "available" ? "text-emerald-600" : "text-red-500"
          }`}>
            {pincodeStatus === "available" ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                Delivery available — estimated in 2–4 business days. Free above ₹999.
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                Delivery not available for this pincode yet.
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile sticky bar ───────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-muted">{product.name}</p>
            <p className="text-base font-bold text-primary">{priceText}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleWishlist}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
                wishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500" : ""}`} />
            </button>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
              <button type="button" onClick={dec} disabled={quantity <= 1} className="flex h-9 w-9 cursor-pointer items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex h-9 w-8 select-none items-center justify-center border-x border-gray-200 text-sm font-bold text-primary">{quantity}</span>
              <button type="button" onClick={inc} className="flex h-9 w-9 cursor-pointer items-center justify-center text-gray-500 hover:bg-gray-50">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-accent px-4 text-sm font-bold text-primary transition hover:bg-accent/90 active:scale-95 disabled:opacity-50"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
