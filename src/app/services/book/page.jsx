"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Wrench,
  Zap,
  Paintbrush,
  Package,
  Sparkles,
  Hammer,
  TreePine,
  HardHat,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

// ─── Service options ───────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { id: "plumbing",      label: "Plumbing",              Icon: Wrench,    desc: "Leak fixes, pipe fitting, bathroom setup",       from: 299 },
  { id: "electrical",    label: "Electrical",            Icon: Zap,       desc: "Wiring, fixtures, panels, safety inspection",    from: 399 },
  { id: "painting",      label: "Painting",              Icon: Paintbrush,desc: "Interior, exterior, texture & waterproofing",    from: 8   },
  { id: "cleaning",      label: "Deep Cleaning",         Icon: Sparkles,  desc: "Kitchen, bathroom, full home sanitisation",      from: 499 },
  { id: "installation",  label: "Appliance Installation",Icon: Package,   desc: "AC, geyser, chimney, furniture assembly",        from: 199 },
  { id: "repair",        label: "Home Repair",           Icon: Hammer,    desc: "Carpentry, doors, drywall, tile fixes",          from: 249 },
  { id: "garden",        label: "Garden & Landscaping",  Icon: TreePine,  desc: "Lawn care, plants, irrigation & design",         from: 499 },
  { id: "construction",  label: "Construction & Civil",  Icon: HardHat,   desc: "Tiling, waterproofing, plastering, civil",       from: 999 },
];

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

const STEPS = ["Service", "Details", "Schedule", "Confirm"];

// ─── Step indicators ───────────────────────────────────────────────────────────

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto">
      {STEPS.map((label, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={label} className="flex items-center gap-0 flex-shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                  done   ? "bg-emerald-500 text-white" :
                  active ? "bg-primary text-white" :
                           "bg-gray-100 text-muted"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-10 sm:w-16 mb-5 mx-1 transition-colors duration-200 ${i < current ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Choose service ────────────────────────────────────────────────────

function StepService({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">What service do you need?</h2>
      <p className="text-sm text-muted mb-5">Select the type of work you want done at your home.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICE_OPTIONS.map(({ id, label, Icon, desc, from }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-100 bg-white hover:border-primary/30 hover:bg-gray-50"
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-primary text-white" : "bg-gray-100 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-primary">{label}</p>
                  {active && <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted mt-0.5 leading-snug">{desc}</p>
                <p className="text-xs font-semibold text-accent mt-1">
                  From ₹{from.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{id === "painting" ? "/sq ft" : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Describe requirements ────────────────────────────────────────────

function StepDetails({ form, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">Describe your requirements</h2>
      <p className="text-sm text-muted mb-5">Help the professional understand what needs to be done.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            placeholder="e.g. Kitchen tap is dripping. Bathroom shower has low pressure. Need a new showerhead installed."
            className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Property Type</label>
            <select
              value={form.propertyType}
              onChange={(e) => onChange("propertyType", e.target.value)}
              className="w-full text-sm text-primary border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-white"
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment / Flat</option>
              <option value="independent">Independent House / Villa</option>
              <option value="commercial">Commercial Space</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Approximate Area (sq ft)</label>
            <input
              type="number"
              value={form.area}
              onChange={(e) => onChange("area", e.target.value)}
              placeholder="e.g. 1200"
              className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5">Any specific brands or materials preferred?</label>
          <input
            type="text"
            value={form.preferences}
            onChange={(e) => onChange("preferences", e.target.value)}
            placeholder="e.g. Asian Paints, Jaquar fittings, ISI certified materials only"
            className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-xl border border-accent/20">
          <input
            type="checkbox"
            id="urgent"
            checked={form.urgent}
            onChange={(e) => onChange("urgent", e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="urgent" className="text-sm font-medium text-primary cursor-pointer">
            This is urgent — I need service within 24 hours
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Schedule ──────────────────────────────────────────────────────────

function StepSchedule({ form, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">Schedule & Address</h2>
      <p className="text-sm text-muted mb-5">Pick a convenient date, time, and provide your address.</p>

      <div className="space-y-4">
        {/* Address */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-semibold text-primary">Service Address</span>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="House / Flat / Building name & number"
              className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={form.area}
                onChange={(e) => onChange("area", e.target.value)}
                placeholder="Area / Locality"
                className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
              />
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => onChange("pincode", e.target.value)}
                placeholder="Pincode"
                maxLength={6}
                className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-semibold text-primary">Preferred Date</span>
          </div>
          <input
            type="date"
            value={form.date}
            min={today}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full text-sm text-primary border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Time slot */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-semibold text-primary">Preferred Time Slot</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const active = form.timeSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => onChange("timeSlot", slot)}
                  className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 text-primary hover:border-primary/40"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm font-semibold text-primary mb-3">Contact Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Your full name"
              className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Mobile number"
              maxLength={10}
              className="w-full text-sm text-primary placeholder:text-muted border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Confirm ───────────────────────────────────────────────────────────

function StepConfirm({ serviceType, form }) {
  const service = SERVICE_OPTIONS.find((s) => s.id === serviceType);
  const { Icon } = service ?? {};

  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">Review & Confirm</h2>
      <p className="text-sm text-muted mb-5">Double-check your booking details before submitting.</p>

      <div className="space-y-3">
        {/* Service */}
        <div className="flex items-center gap-4 p-4 bg-primary rounded-xl text-white">
          {Icon && <Icon className="h-6 w-6 text-accent flex-shrink-0" />}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Service</p>
            <p className="text-sm font-bold">{service?.label}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Requirements</p>
          <p className="text-sm text-primary">{form.description || "—"}</p>
          {form.propertyType && (
            <p className="text-xs text-muted">Property: {form.propertyType}</p>
          )}
          {form.urgent && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
              Urgent — within 24 hrs
            </span>
          )}
        </div>

        {/* Schedule */}
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Schedule</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            <span className="text-sm text-primary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              {form.date || "—"}
            </span>
            <span className="text-sm text-primary flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {form.timeSlot || "—"}
            </span>
          </div>
        </div>

        {/* Address & Contact */}
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Address & Contact</p>
          <p className="text-sm text-primary flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
            {[form.address, form.area, form.pincode].filter(Boolean).join(", ") || "—"}
          </p>
          <p className="text-sm text-primary mt-1">{form.name} · {form.phone}</p>
        </div>
      </div>
    </div>
  );
}


// ─── Main page ─────────────────────────────────────────────────────────────────

function BookServiceContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const typeFromURL   = searchParams.get("type") ?? "";

  const [step,        setStep]        = useState(typeFromURL ? 1 : 0);
  const [serviceType, setServiceType] = useState(typeFromURL);

  const [details, setDetails] = useState({
    description:  "",
    propertyType: "",
    area:         "",
    preferences:  "",
    urgent:       false,
  });

  const [schedule, setSchedule] = useState({
    address:  "",
    area:     "",
    pincode:  "",
    date:     "",
    timeSlot: "",
    name:     "",
    phone:    "",
  });

  function updateDetails(key, value) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function updateSchedule(key, value) {
    setSchedule((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed() {
    if (step === 0) return !!serviceType;
    if (step === 1) return !!details.description.trim();
    if (step === 2) return !!(schedule.address && schedule.date && schedule.timeSlot && schedule.name && schedule.phone);
    return true;
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const ref = `BB-${Math.floor(100000 + Math.random() * 900000)}`;
      const service = SERVICE_OPTIONS.find((s) => s.id === serviceType);
      const booking = {
        ref,
        serviceId:   serviceType,
        serviceName: service?.label ?? serviceType,
        ...details,
        ...schedule,
        bookedAt: new Date().toISOString(),
        status: "confirmed",
      };
      const existing = JSON.parse(localStorage.getItem("bb_bookings") || "[]");
      localStorage.setItem("bb_bookings", JSON.stringify([booking, ...existing]));
      router.push(`/services/booking-success?ref=${ref}`);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
    else router.push("/services");
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-medium">Book Service</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <StepBar current={step} />

          {step === 0 && (
            <StepService selected={serviceType} onSelect={setServiceType} />
          )}
          {step === 1 && (
            <StepDetails form={details} onChange={updateDetails} />
          )}
          {step === 2 && (
            <StepSchedule form={schedule} onChange={updateSchedule} />
          )}
          {step === 3 && (
            <StepConfirm serviceType={serviceType} form={{ ...details, ...schedule }} />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              {step === 0 ? "All Services" : "Back"}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              {step === STEPS.length - 1 ? "Confirm Booking" : "Continue"}
              {step < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
              {step === STEPS.length - 1 && <Check className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense>
      <BookServiceContent />
    </Suspense>
  );
}
