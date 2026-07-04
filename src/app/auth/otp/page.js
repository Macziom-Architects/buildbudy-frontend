"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Phone, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_PHONE, DEMO_OTP } from "@/lib/api/auth";

function OTPForm() {
  const router = useRouter();
  const { requestOtp, verifyOtp } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [phone, setPhone] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    const pending = localStorage.getItem("bb_pending_phone");
    if (!pending) {
      router.replace("/auth/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate phone from localStorage on mount
    setPhone(pending);
    inputs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (timer <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- countdown reaching zero flips resend availability
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (error) setError("");
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

  async function handleResend() {
    setOtp(Array(6).fill(""));
    setTimer(60);
    setCanResend(false);
    setError("");
    inputs.current[0]?.focus();
    try {
      await requestOtp(phone);
    } catch (err) {
      setError(err?.message || "Failed to resend OTP. Please try again.");
    }
  }

  async function handleVerify() {
    const otpCode = otp.join("");
    if (otpCode.length < 6) return;
    setVerifying(true);
    setError("");
    try {
      const { isNewUser } = await verifyOtp(phone, otpCode);
      localStorage.removeItem("bb_pending_phone");
      if (isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err?.message || "Invalid OTP. Please try again.");
      setVerifying(false);
    }
  }

  const isComplete = otp.every((d) => d !== "");
  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`
    : "your mobile number";

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Phone className="h-7 w-7 text-accent" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-1">Verify OTP</h1>
        <p className="text-sm text-muted mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="text-primary font-semibold">{maskedPhone}</span>
        </p>

        {phone === DEMO_PHONE && (
          <p className="text-xs text-accent font-semibold bg-accent/10 rounded-md px-3 py-2 mb-4">
            Demo account — enter {DEMO_OTP} to continue
          </p>
        )}

        <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
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

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={!isComplete || verifying}
          className={`w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 transition-colors mb-4 flex items-center justify-center gap-2 ${
            isComplete && !verifying
              ? "hover:bg-accent/90 cursor-pointer"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          {verifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Verify &amp; Continue
            </>
          )}
        </button>

        <p className="text-sm text-muted">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          ) : (
            <>
              Resend in{" "}
              <span className="text-primary font-semibold">{timer}s</span>
            </>
          )}
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="mt-5 text-xs text-muted hover:text-primary transition-colors cursor-pointer"
        >
          ← Change mobile number
        </button>
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
