import Link from "next/link";
import { Truck } from "lucide-react";

/**
 * Slim full-width horizontal banner. Data-driven from
 * src/data/homepage_promotions.json -> horizontalBanners.freeDelivery.
 */
export default function FreeDeliveryStrip({ banner }) {
  if (!banner) return null;

  return (
    <section className="bg-primary">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center sm:text-left">
          <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
            <Truck className="h-5 w-5 text-accent" />
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2.5">
            <h3 className="text-sm font-bold text-white">{banner.title}</h3>
            <p className="text-xs text-white/55">{banner.subtitle}</p>
          </div>
          <Link
            href={banner.ctaHref}
            className="flex-shrink-0 inline-flex items-center justify-center rounded-md font-semibold px-4 py-2 text-xs bg-accent text-primary hover:brightness-95 active:scale-[0.98] transition-all duration-150"
          >
            {banner.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
