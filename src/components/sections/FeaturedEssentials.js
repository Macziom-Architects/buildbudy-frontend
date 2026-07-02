import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { fetchEssentialProducts } from "@/lib/api/products";

const BADGE_COLORS = {
  "Best Seller": "bg-accent text-primary",
  "Top Rated":   "bg-primary text-white",
  "New":         "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "Featured":    "bg-primary text-accent",
};

function UseCasePill({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full w-fit">
      <Sparkles className="h-3 w-3 flex-shrink-0" />
      {label}
    </span>
  );
}

const USE_CASE_MAP = {
  materials:  "Essential for Construction",
  tools:      "Pro Grade Performance",
  hardware:   "Reliable Fit & Finish",
  plumbing:   "Leak-Proof Plumbing",
  electrical: "Safe & Efficient Wiring",
  paint:      "Premium Surface Finish",
};

function HighlightCard({ product }) {
  const { name, price, originalPrice, image, badge, routeCategory, id, slug } = product;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const useCase = USE_CASE_MAP[routeCategory] || "Top Choice";

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <Link href={`/products/${slug ?? id}`} className="block relative aspect-[2/1] flex-shrink-0 overflow-hidden">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${BADGE_COLORS[badge] ?? "bg-primary text-white"}`}>
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-contain bg-gray-50 p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          priority
        />
      </Link>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <UseCasePill label={useCase} />
        <Link href={`/products/${slug ?? id}`}>
          <h3 className="text-base font-bold text-primary leading-snug hover:text-accent transition-colors duration-150 line-clamp-2">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted leading-relaxed line-clamp-2">
          {product.description || "Professional-grade product for your next project."}
        </p>
        <div className="flex items-baseline gap-2 pt-1 mt-auto">
          <span className="text-lg font-bold text-primary">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-muted line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <Link
          href={`/products/${slug ?? id}`}
          className="mt-1 inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm font-semibold rounded-md bg-accent text-primary hover:brightness-95 hover:scale-[1.01] active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          View Product
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function MiniCard({ product }) {
  const { name, price, originalPrice, image, badge, routeCategory, id, slug } = product;
  const useCase = USE_CASE_MAP[routeCategory] || "Top Rated";
  return (
    <Link
      href={`/products/${slug ?? id}`}
      className="group flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="80px"
          className="object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />
      </div>
      <div className="flex flex-col justify-center gap-1.5 min-w-0">
        {badge && (
          <span className={`self-start text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${BADGE_COLORS[badge] ?? "bg-primary text-white"}`}>
            {badge}
          </span>
        )}
        <h4 className="text-xs font-bold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-150">
          {name}
        </h4>
        <p className="text-[10px] text-muted flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-accent flex-shrink-0" />
          {useCase}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-primary">₹{price.toLocaleString("en-IN")}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-[11px] text-muted line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function FeaturedEssentials() {
  const picks     = await fetchEssentialProducts(5);
  const highlight = picks[0];
  const miniItems = picks.slice(1, 5);

  if (!highlight) return null;

  return (
    <section className="bg-[#F9FAFB] py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Build Smart: Featured Essentials
            </h2>
            <p className="mt-1 text-sm text-muted">
              Handpicked materials and tools for your next project
            </p>
          </div>
          <Link
            href="/materials"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors flex-shrink-0"
          >
            Shop materials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
          <div className="md:col-span-2">
            <HighlightCard product={highlight} />
          </div>
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {miniItems.map((p) => (
              <MiniCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
