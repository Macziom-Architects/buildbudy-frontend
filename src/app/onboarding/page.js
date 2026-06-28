"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Hammer, Wrench, Briefcase, Search,
  Home, Package, Zap,
  CheckCircle2, XCircle,
  MapPin, CheckCircle, User,
} from "lucide-react";

const PREFERENCE_STEPS = [
  {
    id: 2,
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
    id: 3,
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
    id: 4,
    title: "Need professional help?",
    type: "single",
    key: "help",
    options: [
      { label: "Yes", icon: CheckCircle2 },
      { label: "No",  icon: XCircle },
    ],
  },
  {
    id: 5,
    title: "Set your location",
    type: "location",
    key: "location",
  },
];

const TOTAL_STEPS = 5;
const INITIAL_PREFS = { project: null, needs: [], help: null, location: null };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [answers, setAnswers] = useState(INITIAL_PREFS);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [locating, setLocating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
    }
  }, [router]);

  const currentPrefStep = PREFERENCE_STEPS.find((s) => s.id === step);

  function selectSingle(label) {
    setAnswers((prev) => ({ ...prev, [currentPrefStep.key]: label }));
  }

  function toggleMulti(label) {
    setAnswers((prev) => {
      const list = prev[currentPrefStep.key];
      return {
        ...prev,
        [currentPrefStep.key]: list.includes(label)
          ? list.filter((o) => o !== label)
          : [...list, label],
      };
    });
  }

  function isSelected(label) {
    const val = answers[currentPrefStep.key];
    return currentPrefStep.type === "multi" ? val.includes(label) : val === label;
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
    if (step === 1) return name.trim().length >= 2;
    if (!currentPrefStep) return false;
    if (currentPrefStep.type === "single") return answers[currentPrefStep.key] !== null;
    if (currentPrefStep.type === "multi")  return answers[currentPrefStep.key].length > 0;
    if (currentPrefStep.type === "location") return !!answers.location || city.trim() !== "";
    return true;
  })();

  function handleContinue() {
    if (step === 1) {
      if (name.trim().length < 2) {
        setNameError("Please enter your full name.");
        return;
      }
      setNameError("");
      setStep(2);
      return;
    }

    if (step === TOTAL_STEPS) {
      const loc =
        answers.location ||
        (city.trim() ? { city, pincode: pincode.trim(), type: "manual" } : null);
      const final = { ...answers, location: loc };
      localStorage.setItem("bb_onboarding", JSON.stringify(final));

      const pending = (() => {
        try { return JSON.parse(localStorage.getItem("bb_signup_pending") || "{}"); } catch { return {}; }
      })();
      const profile = {
        name: name.trim(),
        phone: pending.phone || "",
        memberSince: pending.memberSince || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      };
      localStorage.setItem("bb_user_profile", JSON.stringify(profile));
      localStorage.removeItem("bb_signup_pending");
      window.dispatchEvent(new Event("storage"));

      setDone(true);
      return;
    }

    setStep((s) => s + 1);
  }

  function handleSkip() {
    if (step === 1) {
      const pending = (() => {
        try { return JSON.parse(localStorage.getItem("bb_signup_pending") || "{}"); } catch { return {}; }
      })();
      const profile = {
        name: "BuildBudy User",
        phone: pending.phone || "",
        memberSince: pending.memberSince || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      };
      localStorage.setItem("bb_user_profile", JSON.stringify(profile));
      localStorage.removeItem("bb_signup_pending");
      window.dispatchEvent(new Event("storage"));
    }
    router.push("/");
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
        <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-14 w-14 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Welcome, {name.trim().split(" ")[0]}!
          </h1>
          <p className="text-sm text-muted mb-8 max-w-xs mx-auto">
            Your BuildBudy experience is personalised. Let&apos;s find what you need.
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
      <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted uppercase tracking-widest">
            Step {step} of {TOTAL_STEPS}
          </span>
          <div className="flex-1 flex gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-accent" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-accent" />
              </div>
              <h1 className="text-lg font-bold text-primary">What should we call you?</h1>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (nameError) setNameError(""); }}
                placeholder="Full Name"
                autoFocus
                className={`border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${
                  nameError ? "border-red-400" : "border-gray-200"
                }`}
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
              <p className="text-xs text-muted">
                This is how we&apos;ll greet you across the app.
              </p>
            </div>
          </>
        )}

        {/* Steps 2–5 — Preference questions */}
        {step > 1 && currentPrefStep && (
          <>
            <h1 className="text-lg font-bold text-primary mb-4">{currentPrefStep.title}</h1>

            {(currentPrefStep.type === "single" || currentPrefStep.type === "multi") && (
              <div className="grid grid-cols-2 gap-2.5">
                {currentPrefStep.options.map(({ label, icon: Icon }) => {
                  const selected = isSelected(label);
                  return (
                    <button
                      key={label}
                      onClick={() =>
                        currentPrefStep.type === "single" ? selectSingle(label) : toggleMulti(label)
                      }
                      className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm font-medium text-left transition-colors duration-150 cursor-pointer ${
                        selected
                          ? "bg-yellow-50 border-yellow-500 text-primary"
                          : "border-gray-200 text-muted hover:border-yellow-400 hover:text-primary"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${selected ? "text-accent" : "text-gray-400"}`}
                      />
                      <span className="leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentPrefStep.type === "location" && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={detectLocation}
                  disabled={locating}
                  className={`flex items-center justify-center gap-2 w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
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
          </>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-muted hover:text-primary transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`bg-accent text-primary font-bold rounded-md px-6 py-2 text-sm transition-colors cursor-pointer ${
              canContinue ? "hover:bg-accent/90" : "opacity-40 cursor-not-allowed"
            }`}
          >
            {step === TOTAL_STEPS ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
