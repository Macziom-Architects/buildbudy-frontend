"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "signup"; // "signup" | "forgot"

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("");
    text.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  }

  function handleResend() {
    setOtp(Array(6).fill(""));
    setTimer(60);
    setCanResend(false);
    inputs.current[0]?.focus();
  }

  function handleVerify() {
    if (otp.join("").length < 6) return;

    localStorage.setItem("bb_logged_in", "true"); // set once

    if (type === "signup") {
      router.push("/onboarding");
    } else {
      router.push("/auth/reset-password");
    }
  }

  const isComplete = otp.every((d) => d !== "");

  const maskedTarget = (() => {
    try {
      if (type === "signup") {
        const d = JSON.parse(localStorage.getItem("bb_signup_pending") || "{}");
        return d.phone || "your phone";
      } else {
        const d = JSON.parse(localStorage.getItem("bb_forgot_target") || "{}");
        return d.target || "your contact";
      }
    } catch {
      return "your contact";
    }
  })();

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-1">Verify OTP</h1>
        <p className="text-sm text-muted mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="text-primary font-medium">{maskedTarget}</span>
        </p>

        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-md text-primary focus:outline-none focus:border-accent transition-colors caret-transparent"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className={`w-full bg-accent text-primary font-bold rounded-md px-4 py-2 transition-colors mb-4 ${
            isComplete ? "hover:bg-accent/90" : "opacity-40 cursor-not-allowed"
          }`}
        >
          Verify
        </button>

        <p className="text-sm text-muted">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-primary font-semibold hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <>
              Resend in{" "}
              <span className="text-primary font-medium">{timer}s</span>
            </>
          )}
        </p>
      </div>
    </main>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPForm />
    </Suspense>
  );
}
