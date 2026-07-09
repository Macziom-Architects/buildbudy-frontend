import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

/**
 * Large split promotional banner (image + text), used for seasonal /
 * partner campaigns. Data-driven from
 * src/data/homepage_promotions.json -> horizontalBanners.buildYourDreamHome.
 */
export default function SplitPromoBanner({ banner }) {
  if (!banner) return null;

  return (
    <section className="bg-[#F9FAFB] py-10 md:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary">
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Image */}
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full min-h-[220px] md:min-h-[300px]">
              <SafeImage
                src={banner.image}
                alt={banner.imageAlt || banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-3.5 px-6 py-8 md:px-10 md:py-10 text-center md:text-left items-center md:items-start">
              {banner.label && (
                <span className="inline-flex items-center rounded-full bg-accent/15 text-accent text-[11px] font-bold uppercase tracking-wide px-3 py-1">
                  {banner.label}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug tracking-tight">
                {banner.title}
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed max-w-sm">
                {banner.subtitle}
              </p>
              <Link
                href={banner.ctaHref}
                className="mt-1 inline-flex items-center justify-center rounded-md font-semibold px-6 py-3 text-sm bg-accent text-primary hover:brightness-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                {banner.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
