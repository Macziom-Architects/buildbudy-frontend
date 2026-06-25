"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [target, setTarget] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("bb_forgot_target", JSON.stringify({ target }));
    router.push("/auth/otp?type=forgot");
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">
          Forgot password?
        </h1>
        <p className="text-sm text-muted mb-6">
          Enter your email or phone. We&apos;ll send a verification code.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">
              Email or Phone
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              placeholder="you@example.com or +91 98765 43210"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2 hover:bg-accent/90 transition-colors"
          >
            Send OTP
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-muted">
          Remembered your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
