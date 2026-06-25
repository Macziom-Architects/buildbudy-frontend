import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { getDiverseFeaturedProducts } from "@/lib/api/products";

export default function FeaturedProducts() {
  const products = getDiverseFeaturedProducts(8, 2);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted">
              Top picks across every category
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors flex-shrink-0"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:border-accent hover:bg-accent/5 transition-colors"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
