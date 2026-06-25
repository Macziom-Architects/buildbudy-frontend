import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const GUIDES = [
  {
    id:          1,
    level:       "Beginner",
    title:       "How to Paint Like a Professional",
    description: "Learn surface prep, primer selection, and brush techniques for a flawless finish every time.",
    href:        "/diy",
  },
  {
    id:          2,
    level:       "Beginner",
    title:       "Fixing a Leaky Pipe at Home",
    description: "Identify and repair common household pipe leaks with basic tools — no plumber needed.",
    href:        "/diy",
  },
  {
    id:          3,
    level:       "Intermediate",
    title:       "Installing LED Panel Lights Safely",
    description: "From wiring basics to mounting — upgrade your home lighting without an electrician.",
    href:        "/diy",
  },
  {
    id:          4,
    level:       "Advanced",
    title:       "Build Your Own Wooden Bookshelf",
    description: "A full woodworking walkthrough — measuring, cutting, assembly, and finishing.",
    href:        "/diy",
  },
];

const LEVEL_STYLES = {
  Beginner:     "bg-blue-50 text-blue-600",
  Intermediate: "bg-amber-50 text-amber-600",
  Advanced:     "bg-red-50 text-red-600",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function GuideCard({ level, title, description, href, hidden }) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 bg-gray-100 rounded-xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${hidden ? "md:hidden" : ""}`}
    >
      {/* Level tag */}
      <span
        className={`self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${LEVEL_STYLES[level] ?? "bg-gray-100 text-gray-600"}`}
      >
        {level}
      </span>

      {/* Title */}
      <h3 className="text-sm font-bold text-primary leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
        {description}
      </p>

      {/* CTA */}
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
        Read Guide
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function LearnSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Master Your Craft
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Step-by-step guides for the modern builder
          </p>
        </div>

        {/* Grid — desktop: 3 cards, mobile: 2×2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {GUIDES.map((guide, index) => (
            <GuideCard
              key={guide.id}
              {...guide}
              hidden={index === 3}
            />
          ))}
        </div>

        {/* Discover more */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/diy"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary border border-gray-200 rounded-md hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Discover More
          </Link>
        </div>

      </div>
    </section>
  );
}
