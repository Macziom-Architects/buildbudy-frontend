"use client";

import { useState, useMemo, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import {
  Search, BookOpen, Wrench, Paintbrush, Droplets, Zap,
  Hammer, HardHat, ChevronRight, Clock, Star, ArrowRight,
  TrendingUp, Play, Filter, X, Bookmark, BookmarkCheck,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",        label: "All Guides",        icon: BookOpen },
  { id: "beginner",   label: "Beginner Guides",    icon: Star },
  { id: "repair",     label: "Home Repair",        icon: Wrench },
  { id: "tools",      label: "Tool Usage",         icon: Hammer },
  { id: "painting",   label: "Painting",           icon: Paintbrush },
  { id: "plumbing",   label: "Plumbing Basics",    icon: Droplets },
  { id: "electrical", label: "Electrical Safety",  icon: Zap },
  { id: "furniture",  label: "Furniture Assembly", icon: HardHat },
  { id: "construction", label: "Construction Tips", icon: HardHat },
];

const DIFFICULTY = {
  Beginner:     { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Intermediate: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Advanced:     { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
};

const GUIDES = [
  {
    id: 1, category: "painting", difficulty: "Beginner",
    title: "How to Paint Like a Professional",
    description: "Master surface prep, primer selection, and brush techniques for a flawless finish — even on your first try.",
    duration: "25 min read", rating: 4.8, reviews: 312,
    tags: ["Paint", "Interior", "Walls"], featured: true,
  },
  {
    id: 2, category: "plumbing", difficulty: "Beginner",
    title: "Fixing a Leaky Pipe at Home",
    description: "Identify and repair common household pipe leaks with basic tools. No plumber needed for most fixes.",
    duration: "18 min read", rating: 4.7, reviews: 245,
    tags: ["Plumbing", "Pipes", "Water"],
  },
  {
    id: 3, category: "electrical", difficulty: "Intermediate",
    title: "Installing LED Panel Lights Safely",
    description: "From wiring basics to mounting — upgrade your home lighting confidently with this step-by-step walkthrough.",
    duration: "30 min read", rating: 4.9, reviews: 198,
    tags: ["Electrical", "Lighting", "LED"], featured: true,
  },
  {
    id: 4, category: "furniture", difficulty: "Beginner",
    title: "Assembling Flat-Pack Furniture the Right Way",
    description: "Avoid common mistakes and finish faster. Tips for reading diagrams, organizing screws, and getting a sturdy result.",
    duration: "15 min read", rating: 4.6, reviews: 421,
    tags: ["Furniture", "Assembly", "IKEA"],
  },
  {
    id: 5, category: "tools", difficulty: "Beginner",
    title: "Understanding Power Drills: A Complete Guide",
    description: "Bits, torque settings, speed controls — everything you need to know before you pick up a drill.",
    duration: "20 min read", rating: 4.7, reviews: 356,
    tags: ["Drills", "Power Tools", "Basics"],
  },
  {
    id: 6, category: "repair", difficulty: "Intermediate",
    title: "Patching Drywall Like a Pro",
    description: "Fill holes, smooth joints, and blend the texture so no one can tell there was ever damage.",
    duration: "22 min read", rating: 4.5, reviews: 187,
    tags: ["Repair", "Drywall", "Walls"],
  },
  {
    id: 7, category: "construction", difficulty: "Advanced",
    title: "Building a Concrete Garden Path",
    description: "Plan, pour, and finish a durable concrete pathway with proper drainage and a clean edge.",
    duration: "45 min read", rating: 4.8, reviews: 134,
    tags: ["Concrete", "Outdoor", "Construction"],
  },
  {
    id: 8, category: "painting", difficulty: "Intermediate",
    title: "Exterior Wall Painting in Indian Climate",
    description: "Choose weather-resistant paints, prep monsoon-affected surfaces, and apply with lasting results.",
    duration: "28 min read", rating: 4.6, reviews: 278,
    tags: ["Paint", "Exterior", "Weatherproofing"],
  },
  {
    id: 9, category: "electrical", difficulty: "Beginner",
    title: "Electrical Safety Basics Every Homeowner Should Know",
    description: "Circuit breakers, live wires, earthing — understand your home's electrical system safely.",
    duration: "20 min read", rating: 4.9, reviews: 501,
    tags: ["Electrical", "Safety", "Basics"],
  },
  {
    id: 10, category: "plumbing", difficulty: "Intermediate",
    title: "Installing a Bathroom Faucet Step by Step",
    description: "Remove the old fixture, handle shut-off valves, and install a new faucet without a mess.",
    duration: "35 min read", rating: 4.7, reviews: 163,
    tags: ["Plumbing", "Bathroom", "Faucet"],
  },
  {
    id: 11, category: "tools", difficulty: "Advanced",
    title: "Angle Grinder Mastery: Cuts, Grinding & Safety",
    description: "Learn disc types, guard positions, spark direction, and cutting techniques for metal and stone.",
    duration: "40 min read", rating: 4.8, reviews: 222,
    tags: ["Grinder", "Metal", "Advanced"],
  },
  {
    id: 12, category: "beginner", difficulty: "Beginner",
    title: "Your First Home Toolbox: What You Actually Need",
    description: "Skip the gimmicks. This is the definitive list of 12 tools every homeowner should own — and why.",
    duration: "12 min read", rating: 4.9, reviews: 892,
    tags: ["Starter", "Essentials", "Tools"], featured: true,
  },
  {
    id: 13, category: "construction", difficulty: "Intermediate",
    title: "How to Mix Cement for Different Applications",
    description: "Water-cement ratios, sand proportions, and mixing techniques for plastering, flooring, and masonry.",
    duration: "20 min read", rating: 4.6, reviews: 309,
    tags: ["Cement", "Concrete", "Mixing"],
  },
  {
    id: 14, category: "repair", difficulty: "Beginner",
    title: "Fixing a Squeaky Door in 10 Minutes",
    description: "Three methods — from household oil to hinge realignment — so you can choose the right fix.",
    duration: "10 min read", rating: 4.5, reviews: 677,
    tags: ["Door", "Quick Fix", "Repair"],
  },
  {
    id: 15, category: "furniture", difficulty: "Advanced",
    title: "Build Your Own Solid Wood Bookshelf",
    description: "A complete woodworking project from measuring and cutting to assembly, sanding, and finishing.",
    duration: "55 min read", rating: 4.9, reviews: 145,
    tags: ["Woodworking", "Shelving", "Build"],
  },
];

const FEATURED_ARTICLES = [
  {
    id: "f1",
    label: "Weekend Project",
    title: "Repaint Your Living Room in One Weekend",
    description: "Complete checklist, tool list, paint quantity calculator, and a step-by-step timeline so your weekend project stays on track.",
    difficulty: "Beginner",
    duration: "Weekend",
    href: "/diy/repaint-living-room",
    accent: "#F0C12D",
    bg: "#132028",
  },
  {
    id: "f2",
    label: "Safety First",
    title: "Home Electrical Safety: 8 Rules to Live By",
    description: "Before you touch any wiring, read this. Practical rules every DIY homeowner must follow to stay safe.",
    difficulty: "Beginner",
    duration: "10 min read",
    href: "/diy/electrical-safety-rules",
    accent: "#F0C12D",
    bg: "#1e3a5f",
  },
  {
    id: "f3",
    label: "Trending",
    title: "Monsoon-Proof Your Home: A Full Checklist",
    description: "Waterproofing, drainage, roof inspection, wall sealing — everything to do before the rains arrive.",
    difficulty: "Intermediate",
    duration: "30 min read",
    href: "/diy/monsoon-proof-home",
    accent: "#F0C12D",
    bg: "#14532d",
  },
];

const TRENDING = [
  "Fixing a leaky tap", "Painting walls", "Drill basics",
  "Cement mixing", "Fuse box safety", "Furniture assembly",
  "Waterproofing roof", "Tile grouting",
];

// ─── Bookmark store (bb_bookmarks) ────────────────────────────────────────────

const BB_KEY = "bb_bookmarks";
const parseBookmarks = (raw) => { try { return JSON.parse(raw || "[]"); } catch { return []; } };
const getBookmarksSnapshot = () => (typeof window === "undefined" ? "[]" : localStorage.getItem(BB_KEY) || "[]");
const serverBookmarksSnapshot = () => "[]";
const subscribeBookmarks = (cb) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

function useBookmarks() {
  const raw = useSyncExternalStore(subscribeBookmarks, getBookmarksSnapshot, serverBookmarksSnapshot);
  const bookmarks = useMemo(() => parseBookmarks(raw), [raw]);
  const isBookmarked = useCallback((id) => bookmarks.some((b) => b.id === id), [bookmarks]);
  const toggleBookmark = useCallback((guide) => {
    const current = parseBookmarks(localStorage.getItem(BB_KEY) || "[]");
    const exists = current.some((b) => b.id === guide.id);
    const updated = exists ? current.filter((b) => b.id !== guide.id) : [guide, ...current];
    localStorage.setItem(BB_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  }, []);
  return { isBookmarked, toggleBookmark };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function DifficultyTag({ level }) {
  const s = DIFFICULTY[level] ?? DIFFICULTY.Beginner;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {level}
    </span>
  );
}

function GuideCard({ guide }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(guide.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Color band by category */}
      <div className="h-1.5 w-full bg-gradient-to-r from-accent to-accent/50" />

      {/* Bookmark button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleBookmark(guide); }}
        title={bookmarked ? "Remove bookmark" : "Save guide"}
        className={`absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
          bookmarked
            ? "bg-primary border-primary text-white"
            : "bg-white border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100 hover:border-primary hover:text-primary"
        }`}
      >
        {bookmarked
          ? <BookmarkCheck className="h-4 w-4" />
          : <Bookmark className="h-4 w-4" />
        }
      </button>

      <Link
        href={`/diy/${guide.id}`}
        className="flex flex-col flex-1 p-5 gap-3 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2 pr-8">
          <DifficultyTag level={guide.difficulty} />
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <Clock className="h-3 w-3" />
            {guide.duration}
          </span>
        </div>

        <h3 className="text-sm font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-200">
          {guide.title}
        </h3>

        <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
          {guide.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {guide.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-primary">{guide.rating}</span>
            <span>({guide.reviews})</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
            Read Guide <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}

function FeaturedCard({ article }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col justify-between rounded-2xl p-6 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      style={{ backgroundColor: article.bg }}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent mb-2">
          {article.label}
        </p>
        <h3 className="text-base font-bold text-white leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
          {article.description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DifficultyTag level={article.difficulty} />
          <span className="text-xs text-white/50">{article.duration}</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-accent group-hover:gap-2.5 transition-all duration-200">
          Read <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DIYPage() {
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [showFilters, setShowFilters]   = useState(false);

  const filtered = useMemo(() => {
    return GUIDES.filter((g) => {
      const matchCat  = activeCategory === "all" || g.category === activeCategory;
      const matchDiff = activeDifficulty === "all" || g.difficulty === activeDifficulty;
      const matchQ    = !query.trim() ||
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.description.toLowerCase().includes(query.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchDiff && matchQ;
    });
  }, [query, activeCategory, activeDifficulty]);

  const hasActiveFilter = activeCategory !== "all" || activeDifficulty !== "all" || query.trim();

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6FA]">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-primary px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-2">
            BuildBudy DIY Hub
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Build It. Fix It. <span className="text-accent">Own It.</span>
          </h1>
          <p className="mt-3 text-base text-white/60 max-w-xl mx-auto">
            Step-by-step guides, safety tips, and project walkthroughs for every skill level — from first-time homeowners to seasoned builders.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-xl shadow-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides, e.g. 'paint wall', 'fix pipe'…"
                className="w-full bg-white pl-11 pr-4 py-3.5 text-sm text-primary outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 bg-accent px-5 py-3.5 text-sm font-bold text-primary hover:bg-accent/90 transition-colors">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {/* Trending pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {TRENDING.map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Articles ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-4 mx-auto w-full max-w-[1400px]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">Featured Guides</h2>
            <p className="text-sm text-muted mt-0.5">Editor-picked projects for this season</p>
          </div>
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURED_ARTICLES.map((a) => <FeaturedCard key={a.id} article={a} />)}
        </div>
      </section>

      {/* ── Main Guide Library ─────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">

        {/* Section header + filter toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary">All Guides</h2>
            <p className="text-sm text-muted mt-0.5">
              {filtered.length} guide{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-primary shadow-sm cursor-pointer"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilter && <span className="h-2 w-2 rounded-full bg-accent" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar Filters ─────────────────────────────────────────── */}
          <aside className={`lg:w-56 lg:flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4 lg:mb-5">
                <span className="text-sm font-bold text-primary">Filters</span>
                {hasActiveFilter && (
                  <button
                    onClick={() => { setActiveCategory("all"); setActiveDifficulty("all"); setQuery(""); }}
                    className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>

              {/* Category filter */}
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Category</p>
              <ul className="space-y-1 mb-6">
                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => setActiveCategory(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                        activeCategory === id
                          ? "bg-primary text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Difficulty filter */}
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Difficulty</p>
              <ul className="space-y-1">
                {["all", "Beginner", "Intermediate", "Advanced"].map((d) => (
                  <li key={d}>
                    <button
                      onClick={() => setActiveDifficulty(d)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                        activeDifficulty === d
                          ? "bg-primary text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {d === "all" ? "All Levels" : (
                        <>
                          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${DIFFICULTY[d]?.dot}`} />
                          {d}
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Guide Grid ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Category pills — horizontal scroll on mobile/tablet */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide lg:hidden">
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === id
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-base font-semibold text-primary mb-1">No guides found</p>
                <p className="text-sm text-muted mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setQuery(""); setActiveCategory("all"); setActiveDifficulty("all"); }}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── CTA Banner ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl px-6 py-10 sm:flex sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Get the Right Tools</p>
            <h3 className="text-xl font-bold text-white mb-1">Ready to Start Your DIY Project?</h3>
            <p className="text-sm text-white/60">Shop professional-grade tools and materials used in our guides.</p>
          </div>
          <Link
            href="/tools"
            className="mt-5 sm:mt-0 flex-shrink-0 inline-flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded-xl text-sm hover:bg-accent/90 transition-colors cursor-pointer"
          >
            <Play className="h-4 w-4" />
            Shop Tools & Materials
          </Link>
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
