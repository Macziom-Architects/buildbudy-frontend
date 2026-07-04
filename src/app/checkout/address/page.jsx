"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, Building2, Plus, Loader2, Check } from "lucide-react";
import { listAddresses } from "@/lib/api/addresses";

const STEPS = [
  { num: "01", label: "Shipping" },
  { num: "02", label: "Review & Pay" },
];

export default function CheckoutAddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(null); // null = loading
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
      return;
    }
    listAddresses()
      .then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) ?? list[0];
        if (def) setSelectedId(def.id);
      })
      .catch(() => setAddresses([]));
  }, [router]);

  function handleContinue() {
    const addr = addresses.find((a) => a.id === selectedId);
    if (!addr) return;
    sessionStorage.setItem("bb_checkout_addr", JSON.stringify(addr));
    router.push("/checkout/review");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${idx === 0 ? "bg-primary text-white" : "text-gray-400"}`}>
                <span className={`text-xs font-bold ${idx === 0 ? "text-accent" : "text-gray-400"}`}>{step.num}</span>
                <span className={`text-xs font-semibold ${idx === 0 ? "text-white" : "text-gray-400"}`}>{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && <span className="mx-1 text-gray-300 text-xs">›</span>}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Delivery Address</h1>
        <p className="text-sm text-muted mt-0.5">Choose where you&apos;d like this order delivered.</p>

        <div className="mt-6 space-y-3">
          {addresses === null ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your addresses…
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <MapPin className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-primary mb-1">No saved addresses</p>
              <p className="text-xs text-muted mb-5">Add a delivery address to continue checkout.</p>
              <Link href="/profile?section=addresses" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" /> Add an Address
              </Link>
            </div>
          ) : (
            <>
              {addresses.map((addr) => {
                const selected = addr.id === selectedId;
                const Icon = addr.label === "Home" ? Home : addr.label === "Office" ? Building2 : MapPin;
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedId(addr.id)}
                    className={`w-full text-left flex items-start gap-3 rounded-xl border-2 bg-white p-4 transition-all cursor-pointer ${
                      selected ? "border-accent shadow-sm" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${selected ? "bg-accent/20" : "bg-primary/5"}`}>
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] font-bold bg-accent text-primary px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-xs text-muted mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="text-xs text-muted">{addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                    <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-accent bg-accent" : "border-gray-300"}`}>
                      {selected && <Check className="h-3 w-3 text-primary" />}
                    </div>
                  </button>
                );
              })}

              <Link href="/profile?section=addresses" className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-500 hover:border-accent hover:text-primary transition-all">
                <Plus className="h-4 w-4" /> Add a new address
              </Link>

              <button
                onClick={handleContinue}
                disabled={!selectedId}
                className="w-full mt-2 bg-accent text-primary font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue to Review &amp; Pay
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
