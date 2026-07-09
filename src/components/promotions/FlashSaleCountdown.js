"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

function useCountdown(durationHours) {
  // Seed with the full duration so server and first client render match
  // exactly — the real end time (which depends on Date.now()) is only
  // resolved once mounted, avoiding an SSR/client hydration mismatch.
  const fullMs = durationHours * 60 * 60 * 1000;
  const [remaining, setRemaining] = useState(fullMs);

  useEffect(() => {
    const endsAt = Date.now() + fullMs;
    const t = setInterval(() => {
      setRemaining(Math.max(0, endsAt - Date.now()));
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
    expired: remaining <= 0,
  };
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="min-w-[3rem] rounded-lg bg-white/10 px-2.5 py-2 text-center backdrop-blur-sm">
        <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">{value}</span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</span>
    </div>
  );
}

/**
 * Reusable flash-sale countdown banner. Fully driven by the `sale` prop
 * (see src/data/homepage_promotions.json -> flashSale) — durationHours is
 * resolved into a live end time on mount.
 */
export default function FlashSaleCountdown({ sale }) {
  const { hours, minutes, seconds, expired } = useCountdown(sale.durationHours ?? 24);

  if (!sale) return null;

  return (
    <section className="bg-[#F9FAFB] py-10 md:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1c24] via-[#132028] to-[#1b3242]">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center">
            {/* Text + countdown */}
            <div className="flex flex-col gap-4 px-6 py-8 md:px-10 md:py-10 text-center md:text-left items-center md:items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent text-[11px] font-bold uppercase tracking-wide px-3 py-1">
                <Zap className="h-3 w-3 fill-accent" />
                {sale.label}
              </span>

              <h2 className="text-2xl md:text-[2.2rem] font-bold text-white leading-[1.15] tracking-tight">
                {sale.title}
              </h2>

              <p className="text-[15px] text-white/60 leading-relaxed max-w-md">
                {sale.subtitle}
              </p>

              {sale.discountLabel && (
                <span className="inline-flex items-center rounded-md bg-accent text-primary text-sm font-bold px-3 py-1.5">
                  {sale.discountLabel}
                </span>
              )}

              {/* Countdown */}
              {!expired ? (
                <div className="flex items-center gap-2 sm:gap-3 pt-1">
                  <TimeBox value={hours} label="Hours" />
                  <span className="text-white/30 text-xl font-bold pb-4">:</span>
                  <TimeBox value={minutes} label="Mins" />
                  <span className="text-white/30 text-xl font-bold pb-4">:</span>
                  <TimeBox value={seconds} label="Secs" />
                </div>
              ) : (
                <p className="text-sm font-semibold text-white/60 pt-1">
                  This deal has ended — check back for the next one!
                </p>
              )}

              <Link
                href={sale.ctaHref}
                className="mt-2 inline-flex items-center justify-center rounded-md font-semibold px-6 py-3 text-sm bg-accent text-primary hover:brightness-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                {sale.ctaText}
              </Link>
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center px-8 pb-10 md:py-10 min-h-[220px] md:min-h-[320px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 w-full max-w-xs mx-auto">
                <SafeImage
                  src={sale.image}
                  alt={sale.title}
                  width={480}
                  height={380}
                  className="w-full h-auto object-contain drop-shadow-2xl rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
