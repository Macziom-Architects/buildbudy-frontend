"use client";

import { useEffect, useState } from "react";
import { X, Home, Building2, MapPin, CheckCircle2, Plus, Loader2 } from "lucide-react";
import { getAddresses, createAddress } from "@/lib/api/addresses";
import { useSelectedAddress } from "@/hooks/useSelectedAddress";
import AddressFormModal from "@/components/shared/AddressFormModal";

function addrIcon(label) {
  return label === "Home"
    ? <Home className="h-3.5 w-3.5" />
    : label === "Office"
      ? <Building2 className="h-3.5 w-3.5" />
      : <MapPin className="h-3.5 w-3.5" />;
}

/**
 * "Change Location" modal — lets the customer pick an existing saved address
 * or add a new one. Selecting an address updates `useSelectedAddress`
 * immediately, which the navbar, checkout, and delivery estimates all read
 * from, so everything stays in sync without a page refresh.
 */
export default function LocationPickerModal({ open, onClose }) {
  const { selectedAddress, selectAddress } = useSelectedAddress();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset to a loading state each time the modal is (re)opened — adjusting
  // state during render, rather than in an effect, per React's "adjusting
  // state when a prop changes" pattern.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setLoading(true);
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getAddresses()
      .then((list) => { if (!cancelled) setAddresses(list ?? []); })
      .catch(() => { if (!cancelled) setAddresses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handlePick(addr) {
    selectAddress(addr);
    onClose();
  }

  async function handleAddNew(form) {
    const created = await createAddress(form);
    setAddresses((prev) => [...prev, created]);
    selectAddress(created);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-label="Choose delivery location"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
            <h3 className="text-base font-bold text-primary">Choose delivery location</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-4 w-4 text-muted" />
            </button>
          </div>

          <div className="p-4 space-y-2.5">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses…
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                No saved addresses yet. Add one to set your delivery location.
              </p>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handlePick(addr)}
                    aria-pressed={isSelected}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected ? "border-accent bg-accent/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        {addrIcon(addr.label)}
                        {addr.label}
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">Default</span>
                        )}
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{addr.name}</p>
                    <p className="text-xs text-muted mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                    <p className="text-xs text-muted">{addr.city}, {addr.state} — {addr.pincode}</p>
                  </button>
                );
              })
            )}

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer text-sm font-semibold text-gray-600 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </button>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddressFormModal
          address={null}
          onClose={() => setShowAddForm(false)}
          onSave={async (form) => {
            await handleAddNew(form);
            onClose();
          }}
        />
      )}
    </>
  );
}
