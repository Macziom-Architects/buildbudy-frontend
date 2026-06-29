"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/api/auth";

function digitsFrom(value, length = 6) {
  const next = Array(length).fill("");
  (value || "").replace(/\D/g, "").slice(0, length).split("").forEach((d, i) => {
    next[i] = d;
  });
  return next;
}

function maskPhone(phone) {
  if (!phone) return "your phone";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `+91 ••••• ${digits.slice(-5)}`;
}

/**
 * Shared OTP verification step used by both the login and signup flows.
 *
 * Props:
 *   phone       — E.164 phone the OTP was sent to (for masking + resend).
 *   initialOtp  — optional code to prefill (dev/test number convenience).
 *   verifyLabel — button text ("Verify & Login" / "Verify & Create account").
 *   onVerified  — async callback receiving the verify result
 *                 ({ accessToken, user }). May throw to surface an error here
 *                 (e.g. a follow-up PATCH that fails) — the boxes reset on throw.
 */
export default function OtpStep({ phone, initialOtp = "", verifyLabel = "Verify", onVerified }) {
  const [otp, setOtp] = useState(() => digitsFrom(initialOtp));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  const canResend = timer <= 0;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
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
    setOtp(digitsFrom(text));
    inputs.current[Math.min(text.length, 5)]?.focus();
  }

  function resetBoxes() {
    setOtp(Array(6).fill(""));
    inputs.current[0]?.focus();
  }

  async function handleResend() {
    resetBoxes();
    setError("");
    setTimer(60);
    try {
      await requestOtp(phone);
    } catch (err) {
      setError(err?.message || "Could not resend OTP.");
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    setError("");
    try {
      const result = await verifyOtp(phone, code);
      await onVerified(result);
    } catch (err) {
      setError(err?.message || "Invalid or expired OTP. Please try again.");
      resetBoxes();
      setLoading(false);
    }
  }

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="text-center">
      <p className="text-sm text-muted mb-6">
        Enter the 6-digit code sent to{" "}
        <span className="text-primary font-medium">{maskPhone(phone)}</span>
      </p>

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
        disabled={!isComplete || loading}
        className={`w-full bg-accent text-primary font-bold rounded-md px-4 py-2 transition-colors mb-4 flex items-center justify-center gap-2 ${
          isComplete && !loading ? "hover:bg-accent/90" : "opacity-40 cursor-not-allowed"
        }`}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Verifying…" : verifyLabel}
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
            Resend in <span className="text-primary font-medium">{timer}s</span>
          </>
        )}
      </p>
    </div>
  );
}
