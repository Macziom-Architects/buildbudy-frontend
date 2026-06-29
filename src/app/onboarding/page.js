"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Hammer, Wrench, Briefcase, Search,
  Home, Package, Zap,
  CheckCircle2, XCircle,
  MapPin, CheckCircle, Loader2,
} from "lucide-react";
import { getProfile, updateProfile } from "@/lib/api/auth";

const STEPS = [
  {
    id: 1,
    title: "What are you building?",
    type: "single",
    key: "project",
    options: [
      { label: "Renovation",        icon: Hammer },
      { label: "DIY Project",       icon: Wrench },
      { label: "Professional Work", icon: Briefcase },
      { label: "Just Browsing",     icon: Search },
    ],
  },
  {
    id: 2,
    title: "What are you looking for?",
    type: "multi",
    key: "needs",
    options: [
      { label: "Tools",             icon: Hammer },
      { label: "Home Improvement",  icon: Home },
      { label: "DIY Projects",      icon: Wrench },
      { label: "Furniture",         icon: Package },
      { label: "Appliances",        icon: Zap },
    ],
  },
  {
    id: 3,
    title: "Need professional help?",
    type: "single",
    key: "help",
    options: [
      { label: "Yes", icon: CheckCircle2 },
      { label: "No",  icon: XCircle },
    ],
  },
  {
    id: 4,
    title: "Set your location",
    type: "location",
    key: "location",
  },
];

const INITIAL = { project: null, needs: [], help: null, location: null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(INITIAL);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [locating, setLocating] = useState(false);
  const [done, setDone] = useState(false);

  // ── Identity step (name + email, both required) ──────────────────────────────
  const [identityDone, setIdentityDone] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [identityError, setIdentityError] = useState("");
  const [checking, setChecking] = useState(true);

  // Gate the page on auth, then skip the identity step if the profile already
  // has name + email (signup collects them, so those users go straight to the
  // preferences quiz; a new user who came via login still gets asked here).
  useEffect(() => {
    if (!localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
      return;
    }
    getProfile()
      .then((u) => {
        if (u?.fullName) setFullName(u.fullName);
        if (u?.email) setEmail(u.email);
        if (u?.fullName && u?.email) setIdentityDone(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <main className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }

  async function handleSaveIdentity(e) {
    e.preventDefault();
    setIdentityError("");

    const name = fullName.trim();
    const mail = email.trim();
    if (name.length < 2) {
      setIdentityError("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(mail)) {
      setIdentityError("Please enter a valid email address.");
      return;
    }

    setSavingIdentity(true);
    try {
      await updateProfile({ fullName: name, email: mail });
      setIdentityDone(true);
    } catch (err) {
      // Backend returns 400 "This email is already in use" on conflict.
      setIdentityError(err?.message || "Could not save your details. Please try again.");
    } finally {
      setSavingIdentity(false);
    }
  }

  // Identity screen comes first — collect name + email before the preferences quiz.
  if (!identityDone) {
    return (
      <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
        <div className="w-full max-w-md bg-surface rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-primary mb-1">Welcome aboard!</h1>
          <p className="text-sm text-muted mb-6">
            Let&apos;s set up your account. Tell us your name and email.
          </p>

          <form onSubmit={handleSaveIdentity} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-primary">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Asha Verma"
                className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

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

            {identityError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {identityError}
              </p>
            )}

            <button
              type="submit"
              disabled={savingIdentity}
              className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {savingIdentity && <Loader2 className="h-4 w-4 animate-spin" />}
              {savingIdentity ? "Saving…" : "Continue"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const current = STEPS[step - 1];

  function selectSingle(label) {
    setAnswers((prev) => ({ ...prev, [current.key]: label }));
  }

  function toggleMulti(label) {
    setAnswers((prev) => {
      const list = prev[current.key];
      return {
        ...prev,
        [current.key]: list.includes(label)
          ? list.filter((o) => o !== label)
          : [...list, label],
      };
    });
  }

  function isSelected(label) {
    const val = answers[current.key];
    return current.type === "multi" ? val.includes(label) : val === label;
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAnswers((prev) => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude, type: "gps" },
        }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  const canContinue = (() => {
    if (!current) return false;
    if (current.type === "single") return answers[current.key] !== null;
    if (current.type === "multi")  return answers[current.key].length > 0;
    if (current.type === "location") return !!answers.location || city.trim() !== "";
    return true;
  })();

  function handleContinue() {
    if (step === 4) {
      const loc =
        answers.location ||
        (city.trim() ? { city, pincode: pincode.trim(), type: "manual" } : null);
      const final = { ...answers, location: loc };
      localStorage.setItem("bb_onboarding", JSON.stringify(final));
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  }

  // Success screen
  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
        <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-14 w-14 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">You&apos;re all set!</h1>
          <p className="text-sm text-muted mb-8 max-w-xs mx-auto">
            Your BuildBudy experience is personalized. Let&apos;s find what you need.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-accent text-primary font-bold rounded-md px-4 py-2.5 hover:bg-accent/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted uppercase tracking-widest">
            Step {step} of 4
          </span>
          <div className="flex-1 flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-accent" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="text-lg font-bold text-primary mb-4">{current.title}</h1>

        {/* Select cards */}
        {(current.type === "single" || current.type === "multi") && (
          <div className="grid grid-cols-2 gap-2.5">
            {current.options.map(({ label, icon: Icon }) => {
              const selected = isSelected(label);
              return (
                <button
                  key={label}
                  onClick={() =>
                    current.type === "single"
                      ? selectSingle(label)
                      : toggleMulti(label)
                  }
                  className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm font-medium text-left transition-colors duration-150 ${
                    selected
                      ? "bg-yellow-50 border-yellow-500 text-primary"
                      : "border-gray-200 text-muted hover:border-yellow-400 hover:text-primary"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      selected ? "text-accent" : "text-gray-400"
                    }`}
                  />
                  <span className="leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Location step */}
        {current.type === "location" && (
          <div className="flex flex-col gap-3">
            <button
              onClick={detectLocation}
              disabled={locating}
              className={`flex items-center justify-center gap-2 w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                answers.location?.type === "gps"
                  ? "bg-yellow-50 border-yellow-500 text-primary"
                  : "border-gray-200 text-muted hover:border-yellow-400 hover:text-primary"
              }`}
            >
              <MapPin className="h-4 w-4" />
              {locating
                ? "Detecting…"
                : answers.location?.type === "gps"
                  ? "Location detected"
                  : "Use my current location"}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted">
              <div className="flex-1 h-px bg-gray-200" />
              <span>or enter manually</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                maxLength={6}
                className="w-28 border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`bg-accent text-primary font-bold rounded-md px-6 py-2 text-sm transition-colors ${
              canContinue
                ? "hover:bg-accent/90"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
