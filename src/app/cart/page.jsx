"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, X, CheckCircle2, Truck, ArrowRight, Minus, Plus,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";

const recommended = getProducts().slice(0, 4);

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Cart is for logged-in users only — bounce guests to login.
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
    }
  }, [router]);

  function handleCheckout() {
    router.push("/checkout/address");
  }

  // The backend is the source of truth for pricing: GST (and any charges) are
  // computed at checkout. No client-side discounts/coupons — the backend has
  // no coupon support yet, so showing one would misstate the charged amount.
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <main className="min-h-screen bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8">

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">YOUR CART</h1>
          <p className="text-sm text-muted mt-0.5">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} item${cartItems.length === 1 ? "" : "s"} in your cart`}
          </p>

          {cartItems.length === 0 ? (
            /* ── Empty state ─────────────────────────────────────────── */
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-9 w-9 text-gray-400" />
              </div>
              <h2 className="text-lg font-bold text-primary">Nothing here yet</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                You haven&apos;t added any items to your cart. Browse our catalog and find what you need.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 cursor-pointer"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 cursor-pointer"
                >
                  View Wishlist
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-5 items-start">

              {/* ── LEFT: Cart items ─────────────────────────────────── */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white p-4 rounded-2xl items-center shadow-sm border border-gray-100"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="w-[88px] h-[88px] shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center hover:border-gray-200 transition-colors"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <ShoppingCart className="h-8 w-8 text-gray-300" />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug || item.id}`}>
                        <h2 className="font-semibold text-primary text-[15px] leading-snug hover:underline line-clamp-2">
                          {item.name}
                        </h2>
                      </Link>
                      <p className="text-xs text-muted mt-0.5 capitalize">{item.category?.replaceAll("-", " ")}</p>

                      {/* Quantity */}
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex h-8 w-8 items-center justify-center border-x border-gray-200 text-sm font-bold text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-semibold text-red-400 hover:text-red-600 hover:underline cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0 pl-2">
                      <p className="font-bold text-base text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted mt-0.5">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}

              </div>

              {/* ── RIGHT: Order summary ──────────────────────────────── */}
              <div className="bg-[#0F1E25] text-white p-5 rounded-2xl h-fit sticky top-24 shadow-md">
                <h2 className="font-bold text-base tracking-wide uppercase border-b border-white/10 pb-3">
                  Order Summary
                </h2>

                <div className="mt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Truck className="h-3 w-3" />
                      GST &amp; delivery
                    </span>
                    <span className="text-xs text-gray-400">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-center font-bold text-base">
                    <span>Total</span>
                    <span className="text-accent text-lg">{formatPrice(subtotal)}+</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full bg-accent text-primary font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] cursor-pointer text-sm tracking-wide transition-all"
                >
                  PROCEED TO CHECKOUT
                </button>

                <div className="mt-4 text-xs text-gray-500 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" /> Secure payments
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" /> Fast delivery
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" /> 30-day guarantee
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-primary">You may also need</h2>
              <Link href="/products" className="text-sm font-bold text-accent hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
