import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Clock, Star,
  Wrench, Zap, Paintbrush, Package, Sparkles, Hammer, TreePine, HardHat,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const SERVICES = [
  {
    id: "plumbing",
    name: "Plumbing",
    tagline: "Leak-free, guaranteed",
    description: "From dripping taps to full bathroom plumbing — our licensed plumbers handle it all. Same-day service available.",
    Icon: Wrench,
    badge: "Most Booked",
    startingFrom: 299,
    highlights: ["Leak detection & repair", "Pipe installation", "Bathroom fittings", "Water tank setup"],
  },
  {
    id: "electrical",
    name: "Electrical",
    tagline: "Safe wiring by certified pros",
    description: "Panel upgrades, fixture installation, and complete wiring solutions. ISI-certified electricians only.",
    Icon: Zap,
    badge: "Top Rated",
    startingFrom: 399,
    highlights: ["Fan & light installation", "Switch & socket fitting", "MCB panel work", "Safety inspection"],
  },
  {
    id: "painting",
    name: "Painting",
    tagline: "Flawless finish, every time",
    description: "Interior and exterior painting with premium paints. Wall prep, priming, and two-coat finish included.",
    Icon: Paintbrush,
    badge: null,
    startingFrom: 8,
    priceUnit: "/sq ft",
    highlights: ["Wall prep & priming", "Interior painting", "Exterior waterproofing", "Texture finish"],
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    tagline: "Spotless, sanitised, refreshed",
    description: "Comprehensive deep cleaning for kitchens, bathrooms, and full homes. Eco-safe commercial-grade equipment.",
    Icon: Sparkles,
    badge: "New",
    startingFrom: 499,
    highlights: ["Kitchen degreasing", "Bathroom sanitisation", "Floor scrubbing", "Sofa steam cleaning"],
  },
  {
    id: "installation",
    name: "Appliance Installation",
    tagline: "Setup done right, first time",
    description: "AC, geyser, chimney, and furniture assembly by manufacturer-trained technicians.",
    Icon: Package,
    badge: "Quick Service",
    startingFrom: 199,
    highlights: ["AC installation", "Geyser & chimney setup", "Furniture assembly", "TV & appliance mounting"],
  },
  {
    id: "repair",
    name: "Home Repair",
    tagline: "Fix it before it costs more",
    description: "Carpentry repairs, door & window fixes, wall patching, and general home maintenance done quickly.",
    Icon: Hammer,
    badge: null,
    startingFrom: 249,
    highlights: ["Door & window repairs", "Drywall & wall patching", "Carpentry fixes", "Tile repairs"],
  },
  {
    id: "garden",
    name: "Garden & Landscaping",
    tagline: "Green spaces, crafted with care",
    description: "Lawn care, plant setup, irrigation systems, and complete garden design by horticulture experts.",
    Icon: TreePine,
    badge: "Seasonal",
    startingFrom: 499,
    highlights: ["Garden design", "Plant selection & setup", "Drip irrigation", "Lawn maintenance"],
  },
  {
    id: "construction",
    name: "Construction & Civil",
    tagline: "Built solid, built right",
    description: "Tiling, waterproofing, plastering, false ceilings, and structural repairs by certified civil contractors.",
    Icon: HardHat,
    badge: null,
    startingFrom: 999,
    highlights: ["Tile & flooring installation", "Wall plastering", "Waterproofing", "False ceilings"],
  },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified Professionals", desc: "Background-checked & licensed" },
  { icon: Clock,       label: "Same-Day Booking",       desc: "Available 7 days a week" },
  { icon: Star,        label: "4.8★ Average Rating",    desc: "From 10,000+ completed jobs" },
];

const BADGE_COLORS = {
  "Most Booked":   "bg-accent text-primary",
  "Top Rated":     "bg-primary text-white",
  "New":           "bg-emerald-500 text-white",
  "Quick Service": "bg-blue-500 text-white",
  "Seasonal":      "bg-orange-500 text-white",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-primary py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #F0C12D 0%, transparent 60%)" }} />

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
            BuildBudy Services
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Expert Home Services,{" "}
            <span className="text-accent">On Demand</span>
          </h1>
          <p className="text-white/60 text-[15px] max-w-xl mx-auto mb-8">
            Book verified professionals for every home project — from plumbing to painting. Transparent pricing, guaranteed work.
          </p>
          <Link
            href="/services/book"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-primary text-sm font-bold rounded-xl hover:brightness-95 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-accent/20"
          >
            Book a Service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TRUST_POINTS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4 border border-white/10">
                <Icon className="h-6 w-6 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ───────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">All Services</h2>
            <p className="mt-1.5 text-sm text-muted">Choose a service to browse specialists and get an instant quote</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => {
              const { Icon } = service;
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
                >
                  {/* Clickable icon + name header */}
                  <Link
                    href={`/services/${service.id}`}
                    className="flex items-center gap-3 p-5 pb-4 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-primary truncate">{service.name}</h3>
                        {service.badge && (
                          <span className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${BADGE_COLORS[service.badge] ?? "bg-gray-100 text-gray-600"}`}>
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-accent font-semibold mt-0.5">{service.tagline}</p>
                    </div>
                  </Link>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mx-5" />

                  {/* Content */}
                  <div className="p-5 pt-4 flex flex-col gap-3 flex-1">
                    <p className="text-xs text-muted leading-relaxed">{service.description}</p>

                    <ul className="space-y-1">
                      {service.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-primary/70">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">From</p>
                        <p className="text-base font-bold text-primary">
                          ₹{service.startingFrom.toLocaleString("en-IN")}
                          {service.priceUnit && <span className="text-xs font-normal text-muted">{service.priceUnit}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/services/${service.id}`}
                          className="px-3 py-1.5 border border-gray-200 text-primary text-xs font-semibold rounded-lg hover:border-primary/40 hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/services/book?type=${service.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Book
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">How It Works</h2>
          <p className="text-sm text-muted mb-10">Book in 3 simple steps</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Choose a Service", desc: "Pick the service you need. Browse specialists, pricing, and reviews before booking." },
              { step: "02", title: "Schedule & Confirm", desc: "Select your preferred date, time, and address. Get instant confirmation." },
              { step: "03", title: "Pro Arrives", desc: "A verified professional arrives on time and completes the job. Guaranteed." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100">
                <span className="text-4xl font-black text-accent/20 leading-none">{step}</span>
                <h3 className="text-sm font-bold text-primary">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/services/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-primary text-sm font-bold rounded-xl hover:brightness-95 active:scale-[0.98] transition-all duration-150"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
