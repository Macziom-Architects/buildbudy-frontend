"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Hammer, Wrench, Briefcase, Search,
  Home, Package, Zap,
  CheckCircle2, XCircle,
  MapPin, CheckCircle, User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createAddress } from "@/lib/api/addresses";
import { INDIAN_STATES } from "@/lib/indianStates";

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
  const { isLoggedIn, user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [answers, setAnswers] = useState(INITIAL_PREFS);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [locating, setLocating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/auth/login");
  }, [isLoggedIn, router]);

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
    if (currentPrefStep.type === "location") return true; // address is optional — always allowed to continue
    return true;
  })();

  async function handleContinue() {
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
      const hasManualAddress = city.trim() || pincode.trim() || state || address.trim();
      const loc =
        answers.location ||
        (hasManualAddress
          ? { address: address.trim(), city: city.trim(), pincode: pincode.trim(), state, type: "manual" }
          : null);
      const preferences = { ...answers, location: loc };
      const phone = user?.phone || localStorage.getItem("bb_pending_phone") || "";

      try {
        await completeOnboarding({ name: name.trim(), phone, preferences });
      } catch {
        // Gracefully continue even if the API call fails so the user isn't stuck
      }

      if (hasManualAddress && city.trim() && pincode.trim() && state) {
        try {
          await createAddress({
            label: "Home",
            name: name.trim(),
            line1: address.trim() || "Address not specified",
            line2: "",
            city: city.trim(),
            state,
            pincode: pincode.trim(),
            phone,
            isDefault: true,
          });
        } catch {
          // Non-blocking — user can add/edit addresses later from their profile
        }
      }

      setDone(true);
      return;
    }

    setStep((s) => s + 1);
  }

  function handleSkip() {
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
                <p className="text-xs text-muted -mt-2">
                  Optional — helps us show accurate delivery estimates. You can skip this and add it later from your profile.
                </p>

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

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address (optional) — House no, street"
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Pincode"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-28 border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="">Select State (optional)</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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
