"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const AUTOPLAY_MS = 6000;

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

/**
 * Auto-playing promotional hero carousel. Slides are entirely data-driven
 * (see src/data/homepage_promotions.json -> heroCarousel) so campaigns can
 * later be swapped for a backend-managed feed without touching this component.
 */
export default function HeroCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const trackRef = useRef(null);

  const count = slides.length;

  const goTo = useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  }

  return (
    <section
      className="relative bg-[#0d1c24] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0d1c24] via-[#132028] to-[#1b3242]">
                {/* Decorative glows */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 md:py-16 min-h-[420px] md:min-h-[480px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center h-full">

                    {/* Text content */}
                    <div className="flex flex-col gap-4 order-2 md:order-1 text-center md:text-left items-center md:items-start">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        {slide.badge && (
                          <span className="inline-flex items-center rounded-full bg-accent/15 text-accent text-[11px] font-bold uppercase tracking-wide px-3 py-1">
                            {slide.badge}
                          </span>
                        )}
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                          {slide.label}
                        </span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight">
                        <HighlightedHeading text={slide.title} highlight={slide.highlight} />
                      </h1>

                      <p className="text-[15px] text-white/60 leading-relaxed max-w-md">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                        {slide.discountLabel && (
                          <span className="inline-flex items-center rounded-md bg-accent text-primary text-sm font-bold px-3 py-1.5">
                            {slide.discountLabel}
                          </span>
                        )}
                        <Link
                          href={slide.ctaHref}
                          className="inline-flex items-center justify-center rounded-md font-semibold px-6 py-3 text-sm bg-accent text-primary hover:brightness-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                        >
                          {slide.ctaText}
                        </Link>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative order-1 md:order-2 w-full aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                      <SafeImage
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority={slide.id === slides[0].id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / next controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous promotion"
            className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all duration-150"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next promotion"
            className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all duration-150"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`cursor-pointer h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
