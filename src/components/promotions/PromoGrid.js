import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

/**
 * Grid of category-specific promotional tiles. Fully data-driven from
 * src/data/homepage_promotions.json -> promoGrid.
 */
export default function PromoGrid({ items = [], title, subtitle }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-primary">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.ctaHref}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.bg} min-h-[200px] flex items-center transition-transform duration-300 hover:-translate-y-1`}
            >
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between w-full gap-4 px-6 py-6 sm:px-7">
                {/* Text */}
                <div className="flex flex-col gap-2.5 min-w-0">
                  {item.badge && (
                    <span className="w-fit inline-flex items-center rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {item.subtitle}
                  </p>
                  {item.discountLabel && (
                    <span className="w-fit inline-flex items-center rounded-md bg-accent text-primary text-xs font-bold px-2.5 py-1">
                      {item.discountLabel}
                    </span>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-accent transition-colors">
                    {item.ctaText} &rarr;
                  </span>
                </div>

                {/* Image */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
