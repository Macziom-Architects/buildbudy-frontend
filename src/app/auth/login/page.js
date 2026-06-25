"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
    if (password.length < 4) {
      setError("Please enter a valid password.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));

    localStorage.setItem("bb_logged_in", "true");
    if (!localStorage.getItem("bb_user_profile")) {
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      localStorage.setItem(
        "bb_user_profile",
        JSON.stringify({
          name,
          email,
          phone: "",
          memberSince: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        })
      );
    }
    window.dispatchEvent(new Event("storage"));
    setLoading(false);
    router.push("/");
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">Sign in to your BuildBudy account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-md px-3 py-2 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
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
            <div className="text-right mt-0.5">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
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
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
