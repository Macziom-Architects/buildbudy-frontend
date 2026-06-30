"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { getAddresses, createAddress } from "@/lib/api/addresses";
import { Home, Building2, MapPin, CheckCircle2 } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  pincode: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
};

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function addrToForm(a) {
  return {
    fullName:     a.name     ?? "",
    phone:        (a.phone   ?? "").replace(/\D/g, "").slice(-10),
    pincode:      a.pincode  ?? "",
    addressLine1: a.line1    ?? "",
    addressLine2: a.line2    ?? "",
    landmark:     "",
    city:         a.city     ?? "",
    state:        a.state    ?? "",
  };
}

export default function AddressPage() {
  const router    = useRouter();
  const { cartItems } = useCart();
  const { isLoggedIn } = useAuth();

  const [form, setForm]               = useState(EMPTY_FORM);
  const [saveAddress, setSaveAddress] = useState(true);
  const [errors, setErrors]           = useState({});

  // Saved addresses loaded from the API (logged-in users only)
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedId, setSelectedSavedId] = useState(null);

  useEffect(() => {
    // If address already chosen this session, skip straight to payment
    if (localStorage.getItem("bb_address")) {
      router.replace("/checkout/payment");
      return;
    }
    if (!isLoggedIn) return;

    getAddresses()
      .then((addrs) => {
        if (!addrs?.length) return;
        setSavedAddresses(addrs);
        // Pre-fill with default address
        const def = addrs.find((a) => a.isDefault) ?? addrs[0];
        setSelectedSavedId(def.id);
        setForm(addrToForm(def));
      })
      .catch(() => {}); // silent — guest fallback is always available
  }, [isLoggedIn, router]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal * 0.1;
  const delivery = subtotal > 999 ? 0 : 99;
  const total    = subtotal - discount + delivery;

  function validate() {
    const e = {};
    if (!form.fullName.trim())              e.fullName    = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))  e.phone       = "Enter a valid 10-digit mobile number";
    if (!/^\d{6}$/.test(form.pincode))     e.pincode     = "Enter a valid 6-digit pincode";
    if (!form.addressLine1.trim())          e.addressLine1 = "Address Line 1 is required";
    if (!form.city.trim())                  e.city        = "City is required";
    if (!form.state)                        e.state       = "Please select a state";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Deselect saved address tile when user modifies form manually
    if (selectedSavedId) setSelectedSavedId(null);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function selectSaved(addr) {
    setSelectedSavedId(addr.id);
    setForm(addrToForm(addr));
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    // Always persist for this checkout session
    localStorage.setItem("bb_address", JSON.stringify(form));

    // Persist to backend only when user explicitly wants to save a NEW address
    if (saveAddress && isLoggedIn && !selectedSavedId) {
      createAddress({
        label:    "Home",
        name:     form.fullName,
        line1:    form.addressLine1,
        line2:    form.addressLine2,
        city:     form.city,
        state:    form.state,
        pincode:  form.pincode,
        phone:    `+91 ${form.phone}`,
        isDefault: savedAddresses.length === 0,
      }).catch(() => {}); // best-effort, don't block checkout
    }

    router.push("/checkout/payment");
  }

  const addrIcon = (label) =>
    label === "Home"
      ? <Home className="h-3.5 w-3.5" />
      : label === "Office"
        ? <Building2 className="h-3.5 w-3.5" />
        : <MapPin className="h-3.5 w-3.5" />;

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8">
        {/* TITLE */}
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Delivery Address</h1>
        <p className="text-sm text-muted mt-0.5">Where should we deliver your order?</p>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          {/* LEFT — FORM */}
          <div className="space-y-5">

            {/* Saved addresses (logged-in users with at least one saved address) */}
            {savedAddresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5">
                <p className="text-sm font-bold text-primary mb-3">Saved Addresses</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const selected = selectedSavedId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => selectSaved(addr)}
                        className={`text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          selected
                            ? "border-accent bg-accent/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold ${selected ? "text-primary" : "text-gray-600"}`}>
                            {addrIcon(addr.label)}
                            {addr.label}
                          </span>
                          {selected && <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-700 font-medium">{addr.name}</p>
                        <p className="text-xs text-muted mt-0.5 truncate">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                        <p className="text-xs text-muted">{addr.city}, {addr.pincode}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted mt-3">Or enter a different address below</p>
              </div>
            )}

            {/* Address form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Row 1: Full Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    maxLength={10}
                  />
                </div>

                {/* Row 2: Pincode + City */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Pincode"
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    maxLength={6}
                  />
                  <Field
                    label="City"
                    name="city"
                    placeholder="Your city"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                  />
                </div>

                {/* Address Lines */}
                <Field
                  label="Address Line 1 *"
                  name="addressLine1"
                  placeholder="House / Flat no., Building, Street"
                  value={form.addressLine1}
                  onChange={handleChange}
                  error={errors.addressLine1}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Address Line 2"
                    name="addressLine2"
                    placeholder="Area, Colony (optional)"
                    value={form.addressLine2}
                    onChange={handleChange}
                  />
                  <Field
                    label="Landmark"
                    name="landmark"
                    placeholder="Near school, temple… (optional)"
                    value={form.landmark}
                    onChange={handleChange}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">State</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full h-10 border rounded px-3 text-sm bg-white text-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                      errors.state ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                {/* Save checkbox (only shown when entering a new address, not selecting saved) */}
                {!selectedSavedId && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 accent-[#F0C12D]"
                    />
                    <span className="text-sm text-primary">Save this address for future orders</span>
                  </label>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  className="w-full bg-accent text-primary font-bold py-2.5 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all text-sm tracking-wide mt-2"
                >
                  CONTINUE TO PAYMENT
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-[#0F1E25] text-white p-5 rounded-lg h-fit sticky top-24 shadow-md">
            <h2 className="font-bold text-base tracking-wide uppercase border-b border-white/10 pb-3">
              Order Summary
            </h2>

            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount (10%)</span>
                <span className="text-green-400 font-medium">−{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Delivery</span>
                <span className="font-medium">
                  {delivery === 0
                    ? <span className="text-green-400">Free</span>
                    : formatPrice(delivery)
                  }
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center font-bold text-base">
                <span>Total</span>
                <span className="text-accent text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1.5">
              <p>✔ Secure payments</p>
              <p>✔ Fast delivery</p>
              <p>✔ 30-day guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", placeholder, value, onChange, error, maxLength }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full h-10 border rounded px-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
