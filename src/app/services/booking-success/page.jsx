"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, Home, ArrowRight, Calendar, Clock,
  MapPin, Phone, User, Package, ChevronRight,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

// ─── Tracking steps ────────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  { id: 0, label: "Booking Confirmed",   desc: "We've received your request",           done: true  },
  { id: 1, label: "Pro Assigned",        desc: "A specialist will be assigned shortly", done: true  },
  { id: 2, label: "Pro En Route",        desc: "Professional is on the way",            done: false },
  { id: 3, label: "Work In Progress",    desc: "Job is being completed",                done: false },
  { id: 4, label: "Completed",           desc: "Job done and verified",                 done: false },
];

// ─── Inner component (needs useSearchParams) ───────────────────────────────────

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("bb_bookings") || "[]");
      const found = ref ? stored.find((b) => b.ref === ref) : stored[0];
      setBooking(found ?? null);
    } catch {
      setBooking(null);
    }
  }, [ref]);

  const bookingRef = ref ?? booking?.ref ?? "BB-000000";
  const serviceName = booking?.serviceName ?? "Home Service";
  const bookedDate  = booking?.date ?? null;
  const bookedSlot  = booking?.timeSlot ?? null;
  const address     = [booking?.address, booking?.area, booking?.pincode].filter(Boolean).join(", ");
  const contactName = booking?.name ?? null;
  const contactPhone = booking?.phone ?? null;

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary py-12 md:py-16 text-center px-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-5">
          <CheckCircle2 className="h-9 w-9 text-emerald-400" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">Booking Confirmed</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">You&apos;re all set!</h1>
        <p className="text-white/60 text-sm max-w-sm mx-auto">
          A verified professional will reach out to confirm within 30 minutes.
        </p>

        {/* Booking reference badge */}
        <div className="inline-block mt-6 bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wide mb-1">Booking Reference</p>
          <p className="text-2xl font-black text-accent tracking-wider">{bookingRef}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Booking summary ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-primary/5 px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-primary flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              Booking Summary
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-semibold text-muted uppercase tracking-wide">Service</span>
              <span className="text-sm font-bold text-primary">{serviceName}</span>
            </div>
            {bookedDate && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs font-semibold text-muted uppercase tracking-wide">Date</span>
                <span className="text-sm text-primary flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  {bookedDate}
                </span>
              </div>
            )}
            {bookedSlot && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs font-semibold text-muted uppercase tracking-wide">Time</span>
                <span className="text-sm text-primary flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  {bookedSlot}
                </span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-3">
                <span className="w-24 text-xs font-semibold text-muted uppercase tracking-wide flex-shrink-0">Address</span>
                <span className="text-sm text-primary flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                  {address}
                </span>
              </div>
            )}
            {contactName && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs font-semibold text-muted uppercase tracking-wide">Contact</span>
                <span className="text-sm text-primary flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-accent" />
                  {contactName}
                  {contactPhone && (
                    <span className="flex items-center gap-1 text-muted">
                      <Phone className="h-3 w-3" />
                      {contactPhone}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Tracking timeline ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-primary mb-5">Booking Status</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100" />

            <div className="space-y-5">
              {TRACKING_STEPS.map((step, i) => (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Circle */}
                  <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    step.done
                      ? "border-emerald-500 bg-emerald-500"
                      : i === 2
                      ? "border-accent bg-accent/10"
                      : "border-gray-200 bg-white"
                  }`}>
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : i === 2 ? (
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-bold ${step.done ? "text-primary" : i === 2 ? "text-accent" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-muted">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Real-time tracking will be available once the professional is assigned.
          </div>
        </div>

        {/* ── What happens next ───────────────────────────────────── */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-primary mb-3">What happens next?</h2>
          <div className="space-y-2.5">
            {[
              "You'll receive an SMS confirmation shortly.",
              "A verified professional will call you within 30 minutes to confirm the slot.",
              "On the day of service, the pro will arrive at the scheduled time.",
              "After completion, you'll be asked to rate the service.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-primary/80">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTAs ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/services"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 cursor-pointer"
          >
            Browse More Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/profile"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-gray-50 cursor-pointer"
          >
            My Orders
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <BookingSuccessContent />
    </Suspense>
  );
}
