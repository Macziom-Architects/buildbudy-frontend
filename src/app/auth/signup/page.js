"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { requestOtp, updateProfile } from "@/lib/api/auth";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("details"); // "details" | "otp"
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [phoneNumber, setPhoneNumber] = useState(""); // normalised
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_logged_in")) {
      router.replace("/");
    }
  }, [router]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const normalised = normalisePhone(form.phone);

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!normalised) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestOtp(normalised);
      setPhoneNumber(normalised);
      if (res?.otp) setDevOtp(res.otp);
      setPhase("otp");
    } catch (err) {
      setError(err?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // After verifying: a new account is created → save the name + email they gave.
  // If the number already had an account, skip the PATCH and just log them in.
  // A throw here (e.g. "email already in use") bubbles up to OtpStep's error UI.
  async function handleVerified({ user }) {
    if (user?.isNewUser) {
      await updateProfile({ fullName: form.name.trim(), email: form.email.trim() });
      router.push("/onboarding");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Create your account</h1>

        {phase === "details" ? (
          <>
            <p className="text-sm text-muted mb-6">Join thousands of homeowners on BuildBudy</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  required
                  placeholder="John Doe"
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  placeholder="you@example.com"
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary">Mobile number</label>
                <div className="flex items-stretch border border-gray-200 rounded-md focus-within:border-accent transition-colors overflow-hidden">
                  <span className="px-3 flex items-center text-sm text-muted bg-gray-50 border-r border-gray-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={set("phone")}
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
                className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending OTP…" : "Continue"}
              </button>
            </form>

            <p className="mt-5 text-sm text-center text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </>
        ) : (
          <OtpStep
            phone={phoneNumber}
            initialOtp={devOtp}
            verifyLabel="Verify & Create account"
            onVerified={handleVerified}
          />
        )}
      </div>
    </main>
  );
}
