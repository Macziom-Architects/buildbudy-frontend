"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function formatPrice(p) {
  return `₹${p.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const METHODS = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI" },
  { id: "netbanking", label: "Net Banking" },
  { id: "cod", label: "Cash on Delivery" },
];

const EMPTY_CARD = { number: "", expiry: "", cvv: "", name: "" };
const EMPTY_UPI = { id: "" };
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState(EMPTY_CARD);
  const [upi, setUpi] = useState(EMPTY_UPI);
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("bb_address")) {
      router.replace("/checkout/address");
    }
  }, [router]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal * 0.1;
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + delivery;

  function handleCardChange(e) {
    const { name, value } = e.target;
    let v = value;
    if (name === "number") v = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") {
      v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    }
    if (name === "cvv") v = value.replace(/\D/g, "").slice(0, 3);
    setCard((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleUpiChange(e) {
    setUpi({ id: e.target.value });
    if (errors.upi) setErrors((prev) => ({ ...prev, upi: undefined }));
  }

  function validate() {
    const e = {};
    if (method === "card") {
      const raw = card.number.replace(/\s/g, "");
      if (raw.length !== 16) e.number = "Enter a valid 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "Enter expiry as MM/YY";
      if (card.cvv.length !== 3) e.cvv = "Enter a valid 3-digit CVV";
      if (!card.name.trim()) e.name = "Cardholder name is required";
    }
    if (method === "upi") {
      if (!/^[\w.\-]+@[\w]+$/.test(upi.id.trim())) e.upi = "Enter a valid UPI ID (e.g. name@upi)";
    }
    if (method === "netbanking") {
      if (!bank) e.bank = "Please select a bank";
    }
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    localStorage.setItem("bb_payment", JSON.stringify({ method, card: method === "card" ? card : null, upi: method === "upi" ? upi : null, bank: method === "netbanking" ? bank : null }));
    router.push("/checkout/review");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Payment</h1>
        <p className="text-sm text-muted mt-0.5">Choose how you'd like to pay.</p>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          {/* LEFT — PAYMENT METHODS */}
          <div className="space-y-3">
            {METHODS.map((m) => (
              <div
                key={m.id}
                onClick={() => { setMethod(m.id); setErrors({}); }}
                className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-colors ${
                  method === m.id ? "border-primary" : "border-transparent"
                }`}
              >
                {/* Method header */}
                <div className="flex items-center gap-3 p-4">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      method === m.id ? "border-primary" : "border-gray-400"
                    }`}
                  >
                    {method === m.id && (
                      <span className="w-2 h-2 rounded-full bg-primary block" />
                    )}
                  </span>
                  <span className="font-semibold text-sm text-primary">{m.label}</span>
                </div>

                {/* Expanded content */}
                {method === m.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    {m.id === "card" && (
                      <div className="mt-3 space-y-3">
                        <CardField label="Card Number" name="number" placeholder="1234 5678 9012 3456" value={card.number} onChange={handleCardChange} error={errors.number} />
                        <CardField label="Cardholder Name" name="name" placeholder="Name on card" value={card.name} onChange={handleCardChange} error={errors.name} />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <CardField label="Expiry (MM/YY)" name="expiry" placeholder="MM/YY" value={card.expiry} onChange={handleCardChange} error={errors.expiry} />
                          <CardField label="CVV" name="cvv" placeholder="3-digit CVV" value={card.cvv} onChange={handleCardChange} error={errors.cvv} type="password" />
                        </div>
                      </div>
                    )}

                    {m.id === "upi" && (
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-primary mb-1">UPI ID</label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={upi.id}
                          onChange={handleUpiChange}
                          className={`w-full h-10 border rounded px-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary ${
                            errors.upi ? "border-red-400" : "border-gray-300"
                          }`}
                        />
                        {errors.upi && <p className="text-red-500 text-xs mt-1">{errors.upi}</p>}
                      </div>
                    )}

                    {m.id === "netbanking" && (
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-primary mb-1">Select Bank</label>
                        <select
                          value={bank}
                          onChange={(e) => { setBank(e.target.value); if (errors.bank) setErrors((p) => ({ ...p, bank: undefined })); }}
                          className={`w-full h-10 border rounded px-3 text-sm bg-white text-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                            errors.bank ? "border-red-400" : "border-gray-300"
                          }`}
                        >
                          <option value="">Choose your bank</option>
                          {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
                      </div>
                    )}

                    {m.id === "cod" && (
                      <p className="mt-3 text-sm text-muted">
                        Pay in cash when your order is delivered. No extra charges.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleContinue}
              className="mt-2 w-full bg-accent text-primary font-bold py-2.5 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all text-sm tracking-wide"
            >
              CONTINUE TO REVIEW
            </button>
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
                  {delivery === 0 ? <span className="text-green-400">Free</span> : formatPrice(delivery)}
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

function CardField({ label, name, placeholder, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-10 border rounded px-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
