"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

function StrengthBar({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  })();

  if (!password) return null;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= score ? colors[score - 1] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-[10px] mt-0.5 font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-amber-500" : score === 3 ? "text-yellow-600" : "text-emerald-600"}`}>
          {labels[score - 1]}
        </p>
      )}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bb_logged_in")) {
      router.replace("/");
    }
  }, [router]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function blur(field) {
    return () => setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const mismatch = touched.confirm && form.confirm && form.password !== form.confirm;
  const weakPw = touched.password && form.password && form.password.length < 6;

  async function handleSubmit(e) {
    e.preventDefault();
    if (mismatch || weakPw) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));
    localStorage.setItem(
      "bb_signup_pending",
      JSON.stringify({ name: form.name, email: form.email, phone: form.phone })
    );
    setLoading(false);
    router.push("/auth/otp?type=signup");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Create your account</h1>
        <p className="text-sm text-muted mb-6">Join thousands of homeowners on BuildBudy</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              onBlur={blur("name")}
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
              onBlur={blur("email")}
              required
              placeholder="you@example.com"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              required
              placeholder="+91 98765 43210"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                onBlur={blur("password")}
                required
                placeholder="••••••••"
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${
                  weakPw ? "border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {weakPw && <p className="text-xs text-red-500">Password must be at least 6 characters</p>}
            <StrengthBar password={form.password} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                onBlur={blur("confirm")}
                required
                placeholder="••••••••"
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${
                  mismatch ? "border-red-400" : form.confirm && !mismatch ? "border-emerald-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
            {form.confirm && !mismatch && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Passwords match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!!mismatch || !!weakPw || loading}
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Processing…" : "Continue"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
