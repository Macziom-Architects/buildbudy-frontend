"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_logged_in")) {
      router.replace("/");
    }
  }, [router]);

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
    await new Promise((res) => setTimeout(res, 700));
    localStorage.setItem("bb_pending_phone", phone);
    setLoading(false);
    router.push("/auth/otp");
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <div className="flex justify-center mb-5">
          <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Phone className="h-7 w-7 text-accent" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-1 text-center">Welcome to BuildBudy</h1>
        <p className="text-sm text-muted mb-6 text-center">
          Enter your mobile number to sign in or create an account
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

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
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
