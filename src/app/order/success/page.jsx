"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { getOrderById } from "@/lib/api/orders";

function formatPrice(p) {
  return `₹${(p ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function deliveryEstimate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const TIMELINE = [
  { label: "Order Confirmed", sub: "We've received your order" },
  { label: "Shipped", sub: "Order dispatched from warehouse" },
  { label: "Out for Delivery", sub: "Arriving today or tomorrow" },
  { label: "Delivered", sub: "Enjoy your purchase!" },
];

const STATUS_STEP = { Placed: 0, Packed: 0, Shipped: 1, "Out for Delivery": 2, Delivered: 3 };

const FEATURES = [
  { icon: "🔒", title: "Secure Payments", desc: "All transactions are encrypted and safe." },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free return policy." },
  { icon: "🚚", title: "Fast Delivery", desc: "Delivered in 3–5 business days." },
];

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { router.replace("/"); return; }
    let active = true;
    getOrderById(orderId)
      .then((o) => { if (active) setOrder(o); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-primary mb-2">Order not found</h1>
        <p className="text-sm text-muted mb-6">We couldn&apos;t find that order.</p>
        <Link href="/orders" className="bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors">View My Orders</Link>
      </div>
    );
  }

  const doneIndex = STATUS_STEP[order.status] ?? 0;
  const { address } = order;

  return (
    <>
      <main className="min-h-screen bg-[#F5F7FA]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 xl:px-8 py-10 space-y-8">

          {/* Hero */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">✓</div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">Order Confirmed!</h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Thanks for shopping with BuildBudy. Your order has been placed and is being processed.
            </p>
            <p className="mt-3 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Order: <span className="text-primary font-bold">{order.orderNumber ?? order.id}</span>
            </p>
            <div className="mt-5 flex gap-3 flex-wrap justify-center">
              <Link href={`/orders/${order.id}`} className="border border-primary text-primary text-sm font-semibold px-5 py-2 rounded hover:bg-primary hover:text-white active:scale-[0.98] cursor-pointer transition-all">
                Track Order
              </Link>
              <Link href="/products" className="bg-accent text-primary text-sm font-bold px-5 py-2 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-6">Order Status</h2>
            <div className="flex items-start gap-0 overflow-x-auto">
              {TIMELINE.map((step, idx) => (
                <div key={step.label} className="flex items-center flex-1 min-w-[120px]">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${idx <= doneIndex ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                      {idx <= doneIndex ? "✓" : idx + 1}
                    </div>
                    <p className={`mt-2 text-xs font-semibold text-center ${idx <= doneIndex ? "text-primary" : "text-gray-400"}`}>{step.label}</p>
                    <p className="text-[11px] text-muted text-center mt-0.5 hidden sm:block">{step.sub}</p>
                  </div>
                  {idx < TIMELINE.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-6 ${idx < doneIndex ? "bg-primary" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Address + summary */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-3">Shipping Address</h2>
              <p className="text-sm text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
              <p className="text-sm text-muted">{address.city}, {address.state} — {address.pincode}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Estimated Delivery</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{deliveryEstimate()}</p>
              </div>
            </div>

            <div className="bg-[#0F1E25] text-white p-5 rounded-lg shadow-md">
              <h2 className="font-bold text-base tracking-wide uppercase border-b border-white/10 pb-3">Order Summary</h2>
              <div className="mt-3 space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                      {item.image && <Image src={item.image} alt={item.name} width={28} height={28} className="object-contain" />}
                    </div>
                    <p className="flex-1 min-w-0 text-xs text-gray-300 truncate">{item.name}</p>
                    <p className="text-xs text-gray-300 shrink-0">×{item.qty}</p>
                    <p className="text-xs font-semibold text-white shrink-0 whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="font-medium">{formatPrice(order.subtotal)}</span></div>
                {order.gst > 0 && <div className="flex justify-between"><span className="text-gray-400">GST</span><span className="font-medium">{formatPrice(order.gst)}</span></div>}
                {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-green-400 font-medium">−{formatPrice(order.discount)}</span></div>}
                <div className="border-t border-white/10 pt-2.5 flex justify-between items-center font-bold text-base">
                  <span>Total Paid</span>
                  <span className="text-accent text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Paid via <span className="text-gray-300 font-medium">{order.payment.method} · {order.payment.label}</span></p>
            </div>
          </div>

          {/* Features */}
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

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA]" />}>
      <SuccessContent />
    </Suspense>
  );
}
