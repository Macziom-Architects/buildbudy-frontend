"use client";

import { useState } from "react";
import { Phone, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [phone, setPhone]       = useState("");
  const [error, setError]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handlePhoneChange(e) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (error) setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <section className="bg-gray-100 py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {submitted ? (
          /* ── Success state ───────────────────────────────────── */
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <CheckCircle className="h-10 w-10 text-accent" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-primary">You&apos;re on the list.</h2>
            <p className="text-sm text-muted max-w-xs">
              Welcome to the Foreman&apos;s List. Expect only the good stuff — right on your phone.
            </p>
          </div>
        ) : (
          /* ── Default state ───────────────────────────────────── */
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-16">

            {/* Left — Text */}
            <div className="flex flex-col gap-3 md:max-w-md">
              <span className="self-start text-[10px] font-bold uppercase tracking-[0.18em] text-accent bg-accent/15 px-3 py-1 rounded-full">
                Foreman&apos;s List
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary leading-snug">
                Join the Foreman&apos;s List
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Get early access to professional-grade tools, build guides, and exclusive trade discounts — delivered to your mobile.
              </p>
            </div>

            {/* Right — Form */}
            <div className="flex flex-col gap-2.5 w-full md:max-w-md flex-shrink-0">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                {/* Mobile input */}
                <div className="relative flex-1 flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:border-accent bg-white transition-all duration-200">
                  <span className="px-3 text-sm font-semibold text-primary border-r border-gray-200 flex-shrink-0 select-none self-stretch flex items-center bg-gray-50">
                    +91
                  </span>
                  <Phone className="absolute right-3 h-4 w-4 text-muted pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    suppressHydrationWarning
                    className="flex-1 pl-3 pr-8 py-2.5 text-sm text-primary bg-transparent outline-none placeholder:text-muted/50"
                  />
                </div>

                {/* Subscribe button */}
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-primary text-sm font-semibold rounded-md hover:brightness-95 hover:scale-[1.01] active:scale-[0.98] transition-all duration-150 cursor-pointer flex-shrink-0"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <p className="text-xs text-muted/60">
                No spam. Only useful updates via SMS.
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
