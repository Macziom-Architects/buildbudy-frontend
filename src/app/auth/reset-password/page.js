"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm && password !== confirm;
  const weakPw = password && password.length < 6;

  async function handleSubmit(e) {
    e.preventDefault();
    if (mismatch || weakPw) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    localStorage.removeItem("bb_forgot_target");
    localStorage.setItem("bb_logged_in", "true");
    window.dispatchEvent(new Event("storage"));
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
        <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-14 w-14 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Password reset!</h1>
          <p className="text-sm text-muted mb-8">
            Your password has been updated. You&apos;re now signed in.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Reset password</h1>
        <p className="text-sm text-muted mb-6">Choose a strong new password for your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">New Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {weakPw && <p className="text-xs text-red-500">At least 6 characters required</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${
                  mismatch ? "border-red-400" : confirm && !mismatch ? "border-emerald-400" : "border-gray-200"
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
          </div>

          <button
            type="submit"
            disabled={!!mismatch || !!weakPw || loading}
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
