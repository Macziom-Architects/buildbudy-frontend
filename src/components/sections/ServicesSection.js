import Link from "next/link";
import { ArrowRight, ShieldCheck, Plus } from "lucide-react";
import ServiceCard from "@/components/ui/ServiceCard";

const SERVICES = [
  {
    id:          1,
    name:        "Plumbing",
    description: "Leak fixes, pipe fitting, and complete plumbing setup.",
    image:       "/plumbing.jpg",
    comboTag:    "Works with Pipe Fittings",
    href:        "/services/book?type=plumbing",
  },
  {
    id:          2,
    name:        "Electrical",
    description: "Safe wiring, fixture installation, and panel setup.",
    image:       "/lighting.jpg",
    comboTag:    "Best with Lighting Products",
    href:        "/services/book?type=electrical",
  },
  {
    id:          3,
    name:        "Painting",
    description: "Interior and exterior painting with a premium finish.",
    image:       "/paint.jpg",
    comboTag:    "Best with Paint Products",
    href:        "/services/book?type=painting",
  },
  {
    id:          4,
    name:        "Installation",
    description: "Appliance, furniture, and fixture setup by verified pros.",
    image:       "/appliance.jpg",
    comboTag:    "Works with Materials",
    href:        "/services/book?type=installation",
  },
];

const TRUST_BADGES = [
  "Verified Professionals",
  "Same-day Booking",
  "Satisfaction Guaranteed",
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Get It Installed. Get It Done.
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Book trusted professionals for your home projects
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mt-4">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── Service cards grid ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
            />
          ))}
        </div>

        {/* ── Discover more ───────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary border border-gray-200 rounded-md hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Discover More Services
          </Link>
        </div>

        {/* ── Featured bundle banner ──────────────────────────────── */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-primary px-6 py-7 md:px-10 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          {/* Text */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              Bundle Offer
            </p>
            <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
              Buy Tiles + Get Installation Service
            </h3>
            <p className="text-sm text-white/55">
              Save on labour when you shop materials with us.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/services/book?type=installation"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-primary text-sm font-semibold rounded-md hover:brightness-95 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Book Bundle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
