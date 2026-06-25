"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  Wrench, Zap, Paintbrush, Package, Sparkles, Hammer, TreePine, HardHat,
  Star, Clock, Shield, CheckCircle2, ChevronDown, ChevronUp, ArrowRight,
  Search, X, Home, ChevronRight, BadgeCheck, Users, ThumbsUp,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { getServiceBySlug, getSpecialists } from "@/lib/servicesData";

// ─── Icon map ──────────────────────────────────────────────────────────────────

const ICONS = { Wrench, Zap, Paintbrush, Package, Sparkles, Hammer, TreePine, HardHat };

// ─── Filter / sort options ─────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "rating",    label: "Top Rated" },
  { value: "reviews",  label: "Most Reviews" },
  { value: "price",    label: "Price: Low" },
  { value: "exp",      label: "Experience" },
];

// ─── Specialist card ───────────────────────────────────────────────────────────

function SpecialistCard({ specialist, serviceId, startingFrom }) {
  const effectivePrice = startingFrom + specialist.priceAdj;
  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm p-5 gap-4 transition-all hover:shadow-md hover:border-gray-200">
      {/* Top row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-primary flex items-center justify-center text-white text-lg font-bold shadow-sm">
          {specialist.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-primary">{specialist.name}</h3>
            <BadgeCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-label="Verified" />
          </div>
          <p className="text-xs text-muted mt-0.5">{specialist.specialization}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {specialist.rating}
            </span>
            <span className="text-xs text-muted">({specialist.reviews} reviews)</span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3 w-3" />
              {specialist.experience} yrs exp
            </span>
          </div>
        </div>

        {/* Availability pill */}
        <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
          specialist.available
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }`}>
          {specialist.available ? "Available" : "Busy"}
        </span>
      </div>

      {/* Price + book */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wide">Starting from</p>
          <p className="text-base font-bold text-primary">₹{effectivePrice.toLocaleString("en-IN")}</p>
        </div>
        <Link
          href={`/services/book?type=${serviceId}`}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            specialist.available
              ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          {specialist.available ? "Book" : "Unavailable"}
          {specialist.available && <ArrowRight className="h-3 w-3" />}
        </Link>
      </div>
    </div>
  );
}

// ─── FAQ item ──────────────────────────────────────────────────────────────────

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-primary">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted" />}
      </button>
      {open && <p className="pb-4 text-sm leading-6 text-gray-500">{a}</p>}
    </div>
  );
}

// ─── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {review.name[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-primary">{review.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {Array(review.rating).fill(0).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
        <time className="text-[11px] text-muted flex-shrink-0">{review.date}</time>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ServiceSlugPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return notFound();

  const specialists = getSpecialists(slug);
  const Icon = ICONS[service.iconKey] ?? Wrench;

  const [search, setSearch]           = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy]           = useState("rating");

  const filtered = useMemo(() => {
    let list = specialists.filter((s) => {
      const matchName = !search.trim() || s.name.toLowerCase().includes(search.toLowerCase()) || s.specialization.toLowerCase().includes(search.toLowerCase());
      const matchAvail = !onlyAvailable || s.available;
      return matchName && matchAvail;
    });
    if (sortBy === "rating")   list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews")  list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "price")    list = [...list].sort((a, b) => a.priceAdj - b.priceAdj);
    if (sortBy === "exp")      list = [...list].sort((a, b) => b.experience - a.experience);
    return list;
  }, [specialists, search, onlyAvailable, sortBy]);

  const avgRating = specialists.length
    ? (specialists.reduce((s, p) => s + p.rating, 0) / specialists.length).toFixed(1)
    : service.rating;

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #F0C12D 0%, transparent 60%)" }} />

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors"><Home className="h-3 w-3"/>Home</Link>
            <ChevronRight className="h-3 w-3"/>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3"/>
            <span className="text-white/80 font-medium">{service.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon badge */}
            <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon className="h-8 w-8 text-accent" />
            </div>

            <div className="flex-1">
              {service.badge && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] bg-accent text-primary px-2.5 py-1 rounded-full mb-2">
                  {service.badge}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-white">{service.name}</h1>
              <p className="mt-1 text-sm text-white/60 max-w-xl">{service.tagline}</p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 mt-4">
                <span className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400"/>
                  <span className="font-bold text-white">{avgRating}</span>
                  <span className="text-white/50">avg rating</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-accent"/>
                  <span className="font-bold text-white">{service.totalJobs.toLocaleString("en-IN")}+</span>
                  <span className="text-white/50">jobs done</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Shield className="h-4 w-4 text-accent"/>
                  <span className="text-white/50">Insured & verified pros</span>
                </span>
              </div>
            </div>

            {/* Desktop CTA */}
            <Link
              href={`/services/book?type=${service.id}`}
              className="hidden md:flex flex-shrink-0 items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded-xl text-sm hover:brightness-95 active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
            >
              Book Now <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── What's included ────────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-primary mb-3">About This Service</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
            <ul className="mt-4 space-y-2">
              {service.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-primary/80">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0"/>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-primary mb-3">Why BuildBudy?</h2>
            <div className="space-y-4">
              {[
                { icon: BadgeCheck, title: "Verified Professionals", desc: "Background-checked, licensed, and rated by real customers." },
                { icon: Shield,     title: "Work Guarantee",         desc: "Every job comes with a warranty. We fix it if something goes wrong." },
                { icon: ThumbsUp,   title: "Transparent Pricing",    desc: "No hidden charges. The price you see is the price you pay." },
              ].map(({ icon: I, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <I className="h-4 w-4 text-primary"/>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{title}</p>
                    <p className="text-xs text-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing tiers ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-1">Pricing</h2>
          <p className="text-sm text-muted mb-6">Choose the package that fits your needs</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {service.pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
                  tier.popular
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-gray-100 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${tier.popular ? "text-white/60" : "text-muted"}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-2xl font-bold ${tier.popular ? "text-white" : "text-primary"}`}>
                    ₹{tier.price.toLocaleString("en-IN")}
                  </span>
                  {(tier.priceUnit ?? service.priceUnit) && (
                    <span className={`text-xs ${tier.popular ? "text-white/60" : "text-muted"}`}>
                      {tier.priceUnit ?? service.priceUnit}
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-4 ${tier.popular ? "text-white/60" : "text-muted"}`}>{tier.desc}</p>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${tier.popular ? "text-accent" : "text-emerald-500"}`}/>
                      <span className={tier.popular ? "text-white/80" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/book?type=${service.id}`}
                  className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all cursor-pointer ${
                    tier.popular
                      ? "bg-accent text-primary hover:brightness-95"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  Book {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Specialists ─────────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-primary">Our Specialists</h2>
              <p className="text-sm text-muted mt-0.5">{filtered.length} professional{filtered.length !== 1 ? "s" : ""} available</p>
            </div>
            <Link
              href={`/services/book?type=${service.id}`}
              className="flex-shrink-0 md:hidden flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 cursor-pointer"
            >
              Book Now <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialization…"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-primary placeholder:text-muted focus:outline-none focus:border-primary/40 transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer"
                >
                  <X className="h-4 w-4"/>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setOnlyAvailable((p) => !p)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  onlyAvailable
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-gray-200 text-primary hover:border-primary/30"
                }`}
              >
                {onlyAvailable ? "✓ Available only" : "Available only"}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[42px] rounded-xl border border-gray-200 bg-white pl-3 pr-7 text-sm font-medium text-primary shadow-sm outline-none focus:border-primary/40 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
              <Users className="h-10 w-10 text-gray-300 mb-3"/>
              <p className="text-base font-semibold text-primary mb-1">No specialists found</p>
              <p className="text-sm text-muted mb-4">Try adjusting your filters</p>
              <button
                onClick={() => { setSearch(""); setOnlyAvailable(false); }}
                className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((spec) => (
                <SpecialistCard
                  key={spec.id}
                  specialist={spec}
                  serviceId={service.id}
                  startingFrom={service.startingFrom}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-1">Frequently Asked Questions</h2>
          <p className="text-sm text-muted mb-5">Everything you need to know about our {service.name.toLowerCase()} service</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
            {service.faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a}/>
            ))}
          </div>
        </section>

        {/* ── Reviews ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-primary">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400"/>
                <span className="text-sm font-bold text-primary">{avgRating}</span>
                <span className="text-sm text-muted">({service.totalJobs}+ bookings)</span>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {service.reviews.map((review) => (
              <ReviewCard key={review.name} review={review}/>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <div className="bg-primary rounded-2xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Ready to book?</p>
            <h3 className="text-xl font-bold text-white">Get a {service.name} Professional Today</h3>
            <p className="text-sm text-white/60 mt-1">Starting from ₹{service.startingFrom.toLocaleString("en-IN")}{service.priceUnit} · Same-day slots available</p>
          </div>
          <Link
            href={`/services/book?type=${service.id}`}
            className="flex-shrink-0 flex items-center gap-2 bg-accent text-primary font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-95 active:scale-[0.98] transition-all shadow-lg shadow-accent/20 cursor-pointer"
          >
            Book Now <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>

        {/* ── Related services ────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted">Browse other services</p>
          <Link href="/services" className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-1">
            All Services <ChevronRight className="h-4 w-4"/>
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer/>
      </div>
    </div>
  );
}
