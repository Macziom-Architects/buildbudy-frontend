import { ShieldCheck, Truck, RotateCcw, BadgeCheck } from "lucide-react";

const FEATURES = [
  {
    icon:        ShieldCheck,
    title:       "Secure Payments",
    description: "100% encrypted transactions",
  },
  {
    icon:        Truck,
    title:       "Fast Delivery",
    description: "Same day dispatch for tools",
  },
  {
    icon:        RotateCcw,
    title:       "Easy Returns",
    description: "30-day no-questions return policy",
  },
  {
    icon:        BadgeCheck,
    title:       "Verified Reviews",
    description: "Real feedback from professionals",
  },
];

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="group flex flex-col items-center text-center gap-3 px-6 py-8 hover:scale-[1.02] transition-transform duration-300">

      {/* Icon with subtle circle */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
        <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
      </div>

      {/* Title */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        {title}
      </p>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed max-w-[160px]">
        {description}
      </p>

    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="bg-[#F9FAFB] py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Mobile: 2×2 grid with gap. Desktop: single row with dividers */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-200">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>

      </div>
    </section>
  );
}
