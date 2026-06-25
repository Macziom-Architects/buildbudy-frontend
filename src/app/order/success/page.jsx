"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/products";

const recommended = getProducts().slice(0, 4);

function formatPrice(p) {
  return `₹${p.toLocaleString("en-IN")}`;
}

function deliveryEstimate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

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

const TIMELINE = [
  { label: "Order Confirmed", sub: "We've received your order" },
  { label: "Shipped", sub: "Order dispatched from warehouse" },
  { label: "Out for Delivery", sub: "Arriving today or tomorrow" },
  { label: "Delivered", sub: "Enjoy your purchase!" },
];

const FEATURES = [
  { icon: "🔒", title: "Secure Payments", desc: "All transactions are encrypted and safe." },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free return policy." },
  { icon: "🚚", title: "Fast Delivery", desc: "Delivered in 3–5 business days." },
];

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bb_order_data");
    if (!raw) { router.replace("/"); return; }
    setOrderData(JSON.parse(raw));
  }, [router]);

  if (!orderData) return null;

  const { orderId, address, payment, items } = orderData;
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal * 0.1;
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + delivery;

  return (
    <>
      <main className="min-h-screen bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-10 space-y-8">

          {/* ── SUCCESS HERO ─────────────────────────────── */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
              ✓
            </div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">Order Confirmed!</h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Thanks for shopping with BuildBudy. Your order has been placed and is being processed.
            </p>
            <p className="mt-3 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Order ID: <span className="text-primary font-bold">{orderId}</span>
            </p>
            <div className="mt-5 flex gap-3 flex-wrap justify-center">
              <button className="border border-primary text-primary text-sm font-semibold px-5 py-2 rounded hover:bg-primary hover:text-white active:scale-[0.98] cursor-pointer transition-all">
                Track Order
              </button>
              <Link
                href="/"
                className="bg-accent text-primary text-sm font-bold px-5 py-2 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── ORDER STATUS TIMELINE ─────────────────────── */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-6">Order Status</h2>
            <div className="flex items-start gap-0 overflow-x-auto">
              {TIMELINE.map((step, idx) => (
                <div key={step.label} className="flex items-center flex-1 min-w-[120px]">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      idx === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {idx === 0 ? "✓" : idx + 1}
                    </div>
                    <p className={`mt-2 text-xs font-semibold text-center ${idx === 0 ? "text-primary" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-muted text-center mt-0.5 hidden sm:block">{step.sub}</p>
                  </div>
                  {idx < TIMELINE.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mb-6 ${idx === 0 ? "bg-primary" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── ADDRESS + ORDER SUMMARY ───────────────────── */}
          <div className="grid lg:grid-cols-2 gap-5">

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-3">Shipping Address</h2>
              <p className="text-sm font-semibold text-primary">{address.fullName}</p>
              <p className="text-sm text-muted mt-0.5">{address.addressLine1}</p>
              {address.addressLine2 && <p className="text-sm text-muted">{address.addressLine2}</p>}
              {address.landmark && <p className="text-sm text-muted">{address.landmark}</p>}
              <p className="text-sm text-muted">{address.city}, {address.state} — {address.pincode}</p>
              <p className="text-sm text-muted mt-0.5">📞 {address.phone}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Estimated Delivery</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{deliveryEstimate()}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#0F1E25] text-white p-5 rounded-lg shadow-md">
              <h2 className="font-bold text-base tracking-wide uppercase border-b border-white/10 pb-3">Order Summary</h2>

              {/* Items */}
              <div className="mt-3 space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 bg-white/10 rounded flex items-center justify-center">
                      <Image src={item.image} alt={item.name} width={28} height={28} className="object-contain" />
                    </div>
                    <p className="flex-1 min-w-0 text-xs text-gray-300 truncate">{item.name}</p>
                    <p className="text-xs text-gray-300 shrink-0">×{item.quantity}</p>
                    <p className="text-xs font-semibold text-white shrink-0 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
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
                <div className="border-t border-white/10 pt-2.5 flex justify-between items-center font-bold text-base">
                  <span>Total Paid</span>
                  <span className="text-accent text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Payment method */}
              <p className="mt-3 text-xs text-gray-500">
                Paid via <span className="text-gray-300 font-medium">{paymentLabel(payment)}</span>
              </p>
            </div>
          </div>

          {/* ── SUPPORT BANNER ───────────────────────────── */}
          <div className="bg-primary text-white rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm">Need help with your order?</p>
              <p className="text-xs text-gray-300 mt-0.5">Our support team is available Mon–Sat, 9am–6pm.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button className="text-xs font-semibold border border-white/30 text-white px-4 py-2 rounded hover:bg-white/10 cursor-pointer transition-colors">
                Contact Support
              </button>
              <button className="text-xs font-semibold bg-accent text-primary px-4 py-2 rounded hover:opacity-80 cursor-pointer transition-colors">
                View FAQs
              </button>
            </div>
          </div>

          {/* ── FEATURES ROW ─────────────────────────────── */}
          <div className="grid sm:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{f.title}</p>
                  <p className="text-xs text-muted mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── YOU MAY ALSO LIKE ─────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-primary">You may also like</h2>
              <Link href="/products" className="text-sm font-bold text-accent hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
