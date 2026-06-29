"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { requestOtp } from "@/lib/api/auth";
import OtpStep from "@/components/auth/OtpStep";

/**
 * Normalise an Indian phone number to E.164 (+91XXXXXXXXXX).
 * Accepts "9876543210", "+91 98765 43210", "098765 43210", etc.
 */
function normalisePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // normalised
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_logged_in")) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const normalised = normalisePhone(phone);
    if (!normalised) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestOtp(normalised);
      setPhoneNumber(normalised);
      // Dev / test number: backend returns the OTP — prefill it for convenience.
      if (res?.otp) setDevOtp(res.otp);
      setPhase("otp");
    } catch (err) {
      setError(err?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // After verifying: existing user is logged in → home. A brand-new number used
  // the login page, so route them to onboarding to complete their account.
  async function handleVerified({ user }) {
    if (user?.isNewUser) {
      router.push("/onboarding");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>

        {phase === "phone" ? (
          <>
            <p className="text-sm text-muted mb-6">
              Enter your mobile number and we&apos;ll send you a one-time password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary">Mobile number</label>
                <div className="flex items-stretch border border-gray-200 rounded-md focus-within:border-accent transition-colors overflow-hidden">
                  <span className="px-3 flex items-center text-sm text-muted bg-gray-50 border-r border-gray-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending OTP…" : "Continue"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-muted">
              New to BuildBudy?{" "}
              <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </>
        ) : (
          <OtpStep
            phone={phoneNumber}
            initialOtp={devOtp}
            verifyLabel="Verify & Login"
            onVerified={handleVerified}
          />
        )}
      </div>
    </main>
  );
}
