import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

function HighlightedHeading({ text, highlight }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className="text-accent">{highlight}</span>
      {after}
    </>
  );
}

export default function PromoBanner({
  label     = "LIMITED TIME OFFER",
  heading   = "Flat 20% Off on All Paint & Wall Solutions",
  highlight = "20%",
  subtext   = "Transform your space with premium paints, tools, and finishes at unbeatable prices.",
  ctaText   = "Shop Now",
  ctaHref   = "/paint",
  image     = "/paint.jpg",
  imageAlt  = "Paint products",
}) {
  return (
    <section className="bg-[#F9FAFB] py-10 md:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Banner card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1c24] via-[#132028] to-[#1b3242]">

          {/* Decorative background glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">

            {/* ── Left: Text content ───────────────────────────── */}
            <div className="flex flex-col gap-4 px-6 py-8 md:px-10 md:py-10 text-center md:text-left items-center md:items-start">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                {label}
              </p>

              <h2 className="text-3xl md:text-[2.6rem] font-bold text-white leading-[1.14] tracking-tight">
                <HighlightedHeading text={heading} highlight={highlight} />
              </h2>

              <p className="text-[15px] text-white/60 leading-relaxed max-w-sm">
                {subtext}
              </p>

              {/* CTA — Link styled as primary button to avoid <a><button> nesting */}
              <Link
                href={ctaHref}
                className="mt-1 inline-flex items-center justify-center rounded-md font-semibold px-6 py-3 text-sm bg-accent text-primary hover:brightness-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                {ctaText}
              </Link>

            </div>

            {/* ── Right: Product image ─────────────────────────── */}
            <div className="relative flex items-center justify-center px-8 pb-12 md:py-12 min-h-[260px] md:min-h-[360px]">

              {/* Glow behind product */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
              </div>

              {/* Product image */}
              <div className="relative z-10 w-full max-w-xs md:max-w-sm mx-auto transition-transform duration-500 ease-out hover:-translate-y-2">
                <SafeImage
                  src={image}
                  alt={imageAlt}
                  width={480}
                  height={380}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
