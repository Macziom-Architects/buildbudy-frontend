"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/layout/Footer";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // CartContext toasts the add itself; only drop the wishlist entry if the
  // item actually made it into the cart.
  async function moveToCart(product) {
    if (await addToCart(product, 1)) removeFromWishlist(product.id);
  }

  return (
    <>
      <main className="min-h-screen bg-[#F5F6F8]">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between py-5">
            <div>
              <h1 className="text-xl font-bold text-primary sm:text-2xl">My Wishlist</h1>
              <p className="mt-0.5 text-sm text-muted">
                {wishlist.length === 0
                  ? "No saved items yet"
                  : `${wishlist.length} saved item${wishlist.length === 1 ? "" : "s"}`}
              </p>
            </div>
            {wishlist.length > 0 && (
              <Link
                href="/products"
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 cursor-pointer"
              >
                Continue Shopping
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          {wishlist.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <Heart className="h-9 w-9 text-red-300" />
              </div>
              <h2 className="text-lg font-bold text-primary">Your wishlist is empty</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                Save items you love by clicking the heart icon on any product. They&apos;ll appear here so you can come back to them later.
              </p>
              <Link
                href="/products"
                className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => {
                const price         = product.price ?? 0;
                const originalPrice = product.originalPrice ?? 0;
                const discount      = originalPrice > price
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0;
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50">
                      {discount > 0 && (
                        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          -{discount}%
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="flex aspect-square items-center justify-center p-5">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-2 p-3.5">
                      <span className="w-fit rounded-md bg-primary/5 px-2 py-0.5 text-[10px] font-semibold capitalize text-primary/70">
                        {product.category?.replaceAll("-", " ")}
                      </span>

                      <Link href={`/products/${product.id}`}>
                        <h2 className="text-[13px] font-semibold leading-[1.4] text-gray-800 line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 pb-3">
                          <span className="text-[11px] font-medium text-gray-500">₹</span>
                          <span className="text-lg font-bold text-gray-900">
                            {price.toLocaleString("en-IN")}
                          </span>
                          {originalPrice > price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveToCart(product)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-[13px] font-bold text-primary transition hover:bg-accent/90 hover:shadow-md active:scale-[0.98] cursor-pointer"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Move to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product.id)}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
