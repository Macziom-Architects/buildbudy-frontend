"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";

function formatPrice(p) {
  return `₹${p.toLocaleString("en-IN")}`;
}

const STEPS = [
  { num: "01", label: "Shipping" },
  { num: "02", label: "Payment" },
  { num: "03", label: "Review" },
];

function paymentLabel(payment) {
  if (!payment) return "—";
  if (payment.method === "card") {
    const last4 = payment.card?.number?.replace(/\s/g, "").slice(-4);
    return `Card ending in ${last4 || "****"}`;
  }
  if (payment.method === "upi") return `UPI — ${payment.upi?.id || ""}`;
  if (payment.method === "netbanking") return `Net Banking — ${payment.bank || ""}`;
  if (payment.method === "cod") return "Cash on Delivery";
  return "—";
}

function generateOrderId() {
  return "BB" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const addr = localStorage.getItem("bb_address");
    const pay = localStorage.getItem("bb_payment");
    if (!addr) { router.replace("/checkout/address"); return; }
    if (!pay) { router.replace("/checkout/payment"); return; }
    setAddress(JSON.parse(addr));
    setPayment(JSON.parse(pay));
  }, [router]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal * 0.1;
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + delivery;

  function handlePlaceOrder() {
    setPlacing(true);
    // Snapshot everything into sessionStorage before clearing
    sessionStorage.setItem("bb_order_data", JSON.stringify({
      orderId: generateOrderId(),
      address: JSON.parse(localStorage.getItem("bb_address")),
      payment: JSON.parse(localStorage.getItem("bb_payment")),
      items: cartItems,
    }));
    clearCart();
    localStorage.removeItem("bb_address");
    localStorage.removeItem("bb_payment");
    router.push("/order/success");
  }

  if (!address || !payment) return null;

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8">

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((step, idx) => {
            const isActive = step.num === "03";
            const isDone = idx < 2;
            return (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${isActive ? "bg-primary text-white" : "text-gray-400"}`}>
                  <span className={`text-xs font-bold ${isActive ? "text-accent" : isDone ? "text-gray-500" : "text-gray-400"}`}>
                    {step.num}
                  </span>
                  <span className={`text-xs font-semibold ${isActive ? "text-white" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <span className="mx-1 text-gray-300 text-xs">›</span>
                )}
              </div>
            );
          })}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Review &amp; Place Order</h1>
        <p className="text-sm text-muted mt-0.5">Check everything before placing your order.</p>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          {/* LEFT */}
          <div className="space-y-4">

            {/* DELIVERY ADDRESS */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-sm text-primary uppercase tracking-wide">Delivery Address</h2>
                <button
                  onClick={() => router.push("/checkout/address")}
                  className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm font-semibold text-primary">{address.fullName}</p>
              <p className="text-sm text-muted mt-0.5">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm text-muted">{address.addressLine2}</p>
              )}
              {address.landmark && (
                <p className="text-sm text-muted">{address.landmark}</p>
              )}
              <p className="text-sm text-muted">
                {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="text-sm text-muted mt-0.5">📞 {address.phone}</p>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-sm text-primary uppercase tracking-wide">Payment Method</h2>
                <button
                  onClick={() => router.push("/checkout/payment")}
                  className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-primary font-medium">{paymentLabel(payment)}</p>
            </div>

            {/* ORDER ITEMS */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-3">
                Order Items ({cartItems.length})
              </h2>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center py-3 first:pt-0 last:pb-0">
                    <div className="min-w-[80px] h-20 shrink-0 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary leading-snug line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-primary shrink-0 whitespace-nowrap pl-2">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — SUMMARY + CTA */}
          <div className="space-y-4">
            <div className="bg-[#0F1E25] text-white p-5 rounded-lg shadow-md">
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

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-accent text-primary font-bold py-2.5 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? "PLACING ORDER…" : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
