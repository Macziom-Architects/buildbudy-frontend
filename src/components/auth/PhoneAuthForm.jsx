"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_PHONE } from "@/lib/api/auth";

/**
 * Shared mobile-number entry screen used by both /auth/login and /auth/signup.
 * Sign In and Sign Up are the same OTP flow — after verification, new numbers
 * are routed to onboarding and existing numbers straight to the homepage.
 */
export default function PhoneAuthForm({ mode = "login" }) {
  const router = useRouter();
  const { isLoggedIn, requestOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  function handlePhoneChange(e) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await requestOtp(phone);
      router.push("/auth/otp");
    } catch (err) {
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <div className="flex justify-center mb-5">
          <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
            {isSignup ? (
              <UserPlus className="h-7 w-7 text-accent" />
            ) : (
              <Phone className="h-7 w-7 text-accent" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-1 text-center">
          {isSignup ? "Create your BuildBudy account" : "Welcome back to BuildBudy"}
        </h1>
        <p className="text-sm text-muted mb-6 text-center">
          {isSignup
            ? "Enter your mobile number — we'll set up your account with a one-time password"
            : "Enter your mobile number to sign in with a one-time password"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Mobile Number</label>
            <div
              className={`flex items-center border rounded-md overflow-hidden transition-colors focus-within:border-accent ${
                error ? "border-red-400" : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2.5 text-sm font-semibold text-primary bg-gray-50 border-r border-gray-200 flex-shrink-0 select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                required
                placeholder="98765 43210"
                autoFocus
                className="flex-1 px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-xs text-muted mt-0.5">
              We&apos;ll send a one-time password to this number
            </p>
            {phone === DEMO_PHONE && (
              <p className="text-xs text-accent font-semibold mt-0.5">
                Demo account detected — use OTP 123456 on the next screen
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Sending OTP…" : "Get OTP"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline cursor-pointer">
                Sign In
              </Link>
            </>
          ) : (
            <>
              New to BuildBudy?{" "}
              <Link href="/auth/signup" className="text-primary font-semibold hover:underline cursor-pointer">
                Create an account
              </Link>
            </>
          )}
        </p>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
          <span>
            Secure &amp; verified. By continuing you agree to our{" "}
            <Link href="/help" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/help" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}
