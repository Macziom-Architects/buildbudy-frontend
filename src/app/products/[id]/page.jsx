import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck, ChevronRight, CircleGauge, Compass,
  PackageCheck, RotateCcw, ShieldCheck, Truck, Zap, Home,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { getProductById, getProducts } from "@/lib/api/products";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";
import ProductFAQ from "./ProductFAQ";
import RecentlyViewed from "./RecentlyViewed";

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURE_COPY = {
  tools: [
    { icon: Zap,          title: "High Output",       body: "Built for dependable performance on repeated site work and demanding home projects." },
    { icon: CircleGauge,  title: "Precision Control", body: "Balanced handling and consistent response keep every cut, drill, or fastening job accurate." },
    { icon: Compass,      title: "Compact Design",    body: "Easy to carry, store, and use in tight corners without compromising worksite durability." },
  ],
  paint: [
    { icon: ShieldCheck,  title: "Smooth Finish",     body: "Designed for even coverage, rich color depth, and a cleaner final surface." },
    { icon: BadgeCheck,   title: "Long Lasting",      body: "Made to resist everyday wear while keeping walls looking fresh for longer." },
    { icon: PackageCheck, title: "Project Ready",     body: "Reliable pack size and finish quality for renovation, repair, and new construction." },
  ],
  default: [
    { icon: ShieldCheck,  title: "Pro Grade",         body: "Selected for reliable construction quality and consistent performance on real projects." },
    { icon: PackageCheck, title: "Site Ready",        body: "Packed for fast procurement, repeat use, and dependable delivery planning." },
    { icon: Compass,      title: "Easy Handling",     body: "Simple to inspect, compare, and use across home, renovation, and contractor workflows." },
  ],
};

const REVIEWS = [
  { name: "Marcus V.", date: "Oct 12, 2023", rating: 5, body: "The quality feels excellent for the price. We used it on a renovation job and the finish stayed consistent through the full day." },
  { name: "Elena G.",  date: "Sep 28, 2023", rating: 5, body: "Perfect balance between value and reliability. Delivery was quick, packaging was clean, and the product matched the listing." },
];

const RATING_DIST = [92, 6, 1, 1, 0];

// ─── Pure helpers (server-safe) ───────────────────────────────────────────────

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price || 0);
}

function titleCase(value = "") {
  return value.replaceAll("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getSpecs(product) {
  const brand = product.brand || product.name.split(" ")[0] || "BuildBudy";
  return [
    ["Brand",        brand],
    ["Category",     titleCase(product.category)],
    ["Availability", product.inStock ? "In Stock" : "Out of Stock"],
    ...(product.rating ? [["Rating", `${product.rating} / 5`]] : []),
    ...(product.reviewsCount > 0 ? [["Reviews", `${product.reviewsCount} verified`]] : []),
  ];
}

function getGalleryImages(product) {
  const extras = (product.images || []).filter((img) => img && img !== product.image);
  const label  = encodeURIComponent(product.name.split(" ").slice(0, 3).join(" "));
  const fallbacks = [
    `https://placehold.co/400x400/f8fafc/132028?text=${label}+Detail`,
    `https://placehold.co/400x400/fff7ed/9a3412?text=${label}+View`,
    `https://placehold.co/400x400/ecfeff/155e75?text=${label}+Pack`,
  ];
  return [product.image, ...extras, ...fallbacks].filter(Boolean).slice(0, 4);
}

function getCompanions(product) {
  const all        = getProducts();
  const sameRoute  = all.filter((p) => p.id !== product.id && p.routeCategory === product.routeCategory && p.inStock);
  const otherRoute = all.filter((p) => p.id !== product.id && p.routeCategory !== product.routeCategory && p.inStock);
  return [...sameRoute, ...otherRoute].slice(0, 4);
}

// ─── Inline star component (server-safe SVG) ──────────────────────────────────

function Stars({ rating, size = "sm" }) {
  const safe  = Number.isFinite(Number(rating)) ? Math.min(5, Math.max(0, Number(rating))) : 0;
  const full  = Math.floor(safe);
  const half  = safe - full >= 0.5 && full < 5;
  const empty = Math.max(0, 5 - full - (half ? 1 : 0));
  const dim   = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  const path  = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
  return (
    <span className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i)  => <svg key={`f${i}`}  className={`${dim} fill-amber-400`} viewBox="0 0 20 20"><path d={path}/></svg>)}
      {half                             && <svg key="h"        className={`${dim} fill-amber-400`} viewBox="0 0 20 20"><path d={path}/></svg>}
      {Array(empty).fill(0).map((_, i) => <svg key={`e${i}`}  className={`${dim} fill-gray-200`}  viewBox="0 0 20 20"><path d={path}/></svg>)}
    </span>
  );
}

// ─── generateStaticParams ─────────────────────────────────────────────────────

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailsPage({ params }) {
  const { id }   = await params;
  const product  = getProductById(id);
  if (!product) notFound();

  const galleryImages = getGalleryImages(product);
  const features      = FEATURE_COPY[product.category] || FEATURE_COPY.default;
  const companions    = getCompanions(product);
  const specs         = getSpecs(product);
  const priceText     = formatPrice(product.price);
  const originalPrice = product.originalPrice ?? 0;
  const discount      = originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-1 flex-col bg-[#F5F6F8]">
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-5 sm:px-6 md:pb-12 lg:px-8">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/"         className="flex items-center gap-1 hover:text-primary transition-colors"><Home className="h-3 w-3"/>Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-300"/>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3 text-gray-300"/>
          <Link href="/products" className="hover:text-primary transition-colors capitalize">{titleCase(product.category)}</Link>
          <ChevronRight className="h-3 w-3 text-gray-300"/>
          <span className="font-semibold text-primary line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── Hero: gallery + info ────────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">

          {/* Left: Gallery */}
          <ProductGallery product={product} galleryImages={galleryImages} />

          {/* Right: Product info */}
          <div className="flex flex-col">

            {/* Badge + category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-primary">
                {product.badge || "Top Rated"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium capitalize text-gray-600">
                {titleCase(product.category)}
              </span>
            </div>

            {/* Product name */}
            <h1 className="mt-3 text-xl font-bold leading-snug text-primary sm:text-2xl">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              {product.rating ? (
                <>
                  <Stars rating={product.rating} />
                  <span className="text-sm font-semibold text-primary">{product.rating}</span>
                  {product.reviewsCount > 0 && (
                    <span className="text-sm text-muted">
                      ({product.reviewsCount.toLocaleString("en-IN")} reviews)
                    </span>
                  )}
                  <span className="h-3.5 w-px bg-gray-200"/>
                </>
              ) : null}
              <span className={`text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-gray-100" />

            {/* Price block */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-gray-500 leading-none">₹</span>
                <span className="text-3xl font-bold leading-none text-primary">
                  {product.price.toLocaleString("en-IN")}
                </span>
              </div>
              {originalPrice > product.price && (
                <div className="flex items-center gap-2 pb-0.5">
                  <span className="text-sm text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                    {discount}% off
                  </span>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-gray-600">
              {product.description ||
                `Professional-grade ${titleCase(product.category).toLowerCase()} selected for modern building, repair, and renovation work. Engineered for dependable performance and long-term reliability.`}
            </p>

            {/* Actions */}
            <ProductActions product={product} priceText={priceText} />

            {/* Delivery row */}
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <Truck className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-xs text-muted">Estimated delivery:</span>
              <span className="text-xs font-semibold text-primary">Wed, Oct 25</span>
              <span className="ml-auto text-xs font-medium text-emerald-600">Free above ₹999</span>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {[
                [ShieldCheck, "Secure", "Payments"],
                [RotateCcw,   "Easy",   "Returns"],
                [PackageCheck,"Fast",   "Delivery"],
              ].map(([Icon, top, bot]) => (
                <div key={top} className="flex flex-col items-center gap-1 py-3 px-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold leading-tight text-primary text-center">{top}</span>
                  <span className="text-[10px] text-muted leading-tight">{bot}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature cards ───────────────────────────────────────────── */}
        <section className="mt-10 md:mt-14">
          <h2 className="mb-5 text-lg font-bold text-primary">Why This Product</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Details + Specs ─────────────────────────────────────────── */}
        <section className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[1fr_320px]">

          {/* Product details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-primary mb-4">Product Details</h2>
            <div className="space-y-3 text-sm leading-7 text-gray-600">
              <p>
                The {product.name} is built for reliable procurement and repeat project use.
                Its finish, materials, and packaging are chosen to support consistent results
                for homeowners, contractors, and site teams.
              </p>
              <p>
                Every listing includes clear pricing, delivery expectations, stock status, and
                verified customer feedback so teams can compare options quickly before placing
                an order.
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h2 className="text-base font-bold text-primary">Specifications</h2>
            </div>
            <dl className="divide-y divide-gray-50">
              {specs.map(([label, value], i) => (
                <div key={label} className={`flex items-center justify-between gap-4 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
                  <dd className="text-right text-sm font-semibold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Reviews ─────────────────────────────────────────────────── */}
        <section className="mt-10 md:mt-14">
          <h2 className="mb-6 text-lg font-bold text-primary">Customer Reviews</h2>

          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

            {/* Rating summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm h-fit">
              <div className="text-center mb-5">
                <p className="text-5xl font-bold text-primary">{product.rating ?? "—"}</p>
                <div className="mt-2 flex justify-center">
                  <Stars rating={product.rating ?? 0} size="lg" />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  {product.reviewsCount > 0
                    ? `${product.reviewsCount.toLocaleString("en-IN")} reviews`
                    : "Be the first to review"}
                </p>
              </div>

              <div className="space-y-2.5">
                {RATING_DIST.map((pct, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs">
                    <span className="w-3 text-right font-semibold text-gray-500">{5 - i}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-gray-400">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div className="space-y-4">
              {REVIEWS.map((review) => (
                <article key={review.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{review.name}</p>
                        <Stars rating={review.rating} />
                      </div>
                    </div>
                    <time className="text-[11px] font-medium text-gray-400">{review.date}</time>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{review.body}</p>
                </article>
              ))}

              <button
                type="button"
                className="h-11 w-full cursor-pointer rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-primary transition hover:border-primary hover:bg-gray-50 active:scale-[0.99]"
              >
                Load More Reviews
              </button>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <ProductFAQ />

        {/* ── Recently viewed ──────────────────────────────────────────── */}
        <RecentlyViewed currentProductId={id} />

        {/* ── Related products ─────────────────────────────────────────── */}
        <section className="mt-10 mb-6 md:mt-14">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-primary">You Might Also Like</h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-primary transition-colors"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            {companions.map((item) => {
              const itemOriginal = item.originalPrice ?? 0;
              const itemDiscount = itemOriginal > item.price
                ? Math.round(((itemOriginal - item.price) / itemOriginal) * 100)
                : 0;
              return (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-gray-50">
                    {itemDiscount > 0 && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{itemDiscount}%
                      </span>
                    )}
                    <div className="flex aspect-square items-center justify-center p-5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={240}
                        height={240}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                    <span className="text-[10px] font-semibold capitalize text-primary/60">
                      {titleCase(item.category)}
                    </span>
                    <h3 className="text-[13px] font-semibold leading-snug text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-1.5 pt-1">
                      <span className="text-base font-bold text-primary">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {itemOriginal > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{itemOriginal.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
