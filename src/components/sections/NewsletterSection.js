"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to real API
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
              Welcome to the Foreman&apos;s List. Expect only the good stuff.
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
                Get early access to professional-grade tools, build guides, and exclusive trade discounts.
              </p>
            </div>

            {/* Right — Form */}
            <div className="flex flex-col gap-2.5 w-full md:max-w-md flex-shrink-0">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                {/* Email input */}
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    suppressHydrationWarning
                    className="w-full pl-10 pr-4 py-2.5 text-sm text-primary bg-white border border-gray-200 rounded-md outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 placeholder:text-muted/50"
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

              <p className="text-xs text-muted/60">
                No spam. Only useful updates.
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
