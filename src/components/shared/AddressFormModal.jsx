"use client";

import { useState } from "react";
import { X, Home, Building2, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { INDIAN_STATES } from "@/lib/indianStates";

const LABEL_OPTIONS = ["Home", "Office", "Other"];

const BLANK_ADDRESS = {
  label: "Home", name: "", line1: "", line2: "",
  city: "", state: "", pincode: "", phone: "", isDefault: false,
};

/**
 * Shared add/edit address form used by the Profile → Saved Addresses section
 * and the navbar's "Change Location" picker, so both stay in sync instead of
 * maintaining two copies of the same form.
 */
export default function AddressFormModal({ address, onClose, onSave }) {
  const [form, setForm] = useState(address ? { ...address } : BLANK_ADDRESS);
  const [saving, setSaving] = useState(false);

  function field(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      // keep modal open on API error
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-base font-bold text-primary">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Address Type</label>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map((opt) => (
                <button
                  key={opt} type="button"
                  onClick={() => setForm((p) => ({ ...p, label: opt }))}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    form.label === opt ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary"
                  }`}
                >
                  {opt === "Home" ? <Home className="h-3 w-3" /> : opt === "Office" ? <Building2 className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input value={form.name} onChange={field("name")} required placeholder="Full Name" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={field("phone")} required placeholder="+91 98765 43210" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Flat / House / Building</label>
            <input value={form.line1} onChange={field("line1")} required placeholder="Flat no, Building name" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Area / Street</label>
            <input value={form.line2} onChange={field("line2")} placeholder="Street, Area, Locality" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Pincode</label>
              <input value={form.pincode} onChange={field("pincode")} required placeholder="400058" maxLength={6} pattern="\d{6}" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">City</label>
              <input value={form.city} onChange={field("city")} required placeholder="Mumbai" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">State</label>
            <select value={form.state} onChange={field("state")} required className={inputCls}>
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
              className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                form.isDefault ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary"
              }`}
            >
              {form.isDefault && <CheckCircle className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm font-medium text-primary">Set as default address</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
