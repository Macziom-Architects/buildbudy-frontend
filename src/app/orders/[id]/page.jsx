"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle,
  MapPin, CreditCard, Phone, ChevronRight, RotateCcw,
  Download, MessageSquare, AlertTriangle, Copy, Star,
  BadgeCheck, Home, AlertCircle,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { OrderDetailSkeleton } from "@/components/ui/Skeleton";
import { useOrder } from "@/hooks/useOrders";
import { STATUS_CONFIG, TRACKING_STEPS, getStepIndex } from "@/lib/ordersData";

// ─── Status icon map ───────────────────────────────────────────────────────────

const STATUS_ICONS = {
  "Placed":           Clock,
  "Packed":           Package,
  "Shipped":          Truck,
  "Out for Delivery": Truck,
  "Delivered":        CheckCircle2,
  "Cancelled":        XCircle,
};

// ─── Card shell ────────────────────────────────────────────────────────────────

function Card({ title, icon: Icon, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-accent" />}
          <h2 className="text-sm font-bold text-primary">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Tracking timeline ─────────────────────────────────────────────────────────

function TrackingTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <Card title="Order Status" icon={XCircle}>
        <div className="flex items-center gap-4 py-2">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-600">Order Cancelled</p>
            <p className="text-xs text-muted mt-0.5">Payment refund will be processed within 5–7 business days.</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentIdx = getStepIndex(status);

  return (
    <Card title="Order Tracking" icon={Truck}>
      <div className="relative">
        <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-gray-100" />
        <div className="space-y-5">
          {TRACKING_STEPS.map((step, i) => {
            const done   = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  done   ? "border-emerald-500 bg-emerald-500" :
                  active ? "border-accent bg-accent/10" :
                           "border-gray-200 bg-white"
                }`}>
                  {done   ? <CheckCircle2 className="h-4 w-4 text-white" /> :
                   active ? <div className="h-2 w-2 rounded-full bg-accent animate-pulse" /> :
                            <div className="h-2 w-2 rounded-full bg-gray-300" />}
                </div>
                <div className="pt-1.5">
                  <p className={`text-sm font-bold ${done ? "text-primary" : active ? "text-accent" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-muted">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        {status === "Delivered"
          ? "Your order was delivered successfully."
          : "Live tracking updates will be sent via SMS."}
      </div>
    </Card>
  );
}

// ─── Items list ────────────────────────────────────────────────────────────────

function ItemsList({ items }) {
  return (
    <Card title="Order Items" icon={Package}>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary leading-snug">{item.name}</p>
              <p className="text-xs text-muted mt-0.5">SKU: {item.sku}</p>
              <p className="text-xs text-muted">Qty: {item.qty}</p>
            </div>
            <p className="text-sm font-bold text-primary flex-shrink-0">
              ₹{(item.price * item.qty).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Payment summary ───────────────────────────────────────────────────────────

function PaymentSummary({ order }) {
  return (
    <Card title="Payment Summary" icon={CreditCard}>
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium">₹{order.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        {order.gst > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">GST</span>
            <span className="font-medium">₹{order.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted">Delivery</span>
          {order.delivery > 0
            ? <span className="font-medium">₹{order.delivery}</span>
            : <span className="text-emerald-600 font-medium">Free</span>}
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">Coupon{order.coupon ? ` (${order.coupon})` : ""}</span>
            <span className="text-emerald-600 font-medium">−₹{order.discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="pt-2.5 border-t border-gray-100 flex justify-between">
          <span className="text-sm font-bold text-primary">Total Paid</span>
          <span className="text-base font-bold text-primary">₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <CreditCard className="h-3.5 w-3.5 text-muted flex-shrink-0" />
          <span className="text-xs text-muted">{order.payment.method} · {order.payment.label}</span>
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 ml-1 flex-shrink-0" />
        </div>
      </div>
    </Card>
  );
}

// ─── Shipping address ──────────────────────────────────────────────────────────

function ShippingAddress({ address }) {
  return (
    <Card title="Delivery Address" icon={MapPin}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
          <Home className="h-4 w-4 text-primary" />
        </div>
        <div>
          {address.name && <p className="text-sm font-bold text-primary">{address.name}</p>}
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
            {address.city}, {address.state} — {address.pincode}
          </p>
          {address.phone && (
            <p className="text-xs text-muted flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3" /> {address.phone}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Not found / error states ───────────────────────────────────────────────────

function OrderNotFound() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <Package className="h-10 w-10 text-gray-300" />
      </div>
      <h1 className="text-xl font-bold text-primary mb-2">Order not found</h1>
      <p className="text-sm text-muted mb-6 max-w-xs">This order ID doesn&apos;t match any records in your account.</p>
      <Link href="/orders" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors">
        <ArrowLeft className="h-4 w-4" /> View All Orders
      </Link>
    </div>
  );
}

function LoadError({ onRetry }) {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h1 className="text-xl font-bold text-primary mb-2">Couldn&apos;t load order</h1>
      <p className="text-sm text-muted mb-6">Check your connection and try again.</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
        <RotateCcw className="h-4 w-4" /> Retry
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams();
  const { order, loading, error, cancelOrder, reorder, refetch } = useOrder(id);

  const [copied, setCopied]           = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [reordered, setReordered]     = useState(false);

  function copyId() {
    navigator.clipboard.writeText(id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleReorder() {
    await reorder();
    setReordered(true);
    setTimeout(() => setReordered(false), 2500);
  }

  // ── Render states ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
        <section className="bg-primary px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-4 w-28 bg-white/10 rounded-md animate-pulse mb-6" />
            <div className="h-7 w-64 bg-white/10 rounded-md animate-pulse mb-3" />
            <div className="h-5 w-40 bg-white/10 rounded-md animate-pulse" />
          </div>
        </section>
        <main className="max-w-4xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <OrderDetailSkeleton />
        </main>
      </div>
    );
  }

  if (error) return <LoadError onRetry={refetch} />;
  if (!order) return <OrderNotFound />;

  const cfg       = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Placed"];
  const StatusIcon = STATUS_ICONS[order.status] ?? Package;
  const canCancel  = !["Delivered", "Cancelled"].includes(order.status);
  const isDelivered = order.status === "Delivered";

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors mb-5">
            <ArrowLeft className="h-3.5 w-3.5" /> All Orders
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">Order Details</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white font-mono">{order.orderNumber ?? order.id}</h1>
                <button onClick={copyId} className="text-white/40 hover:text-white/80 transition-colors cursor-pointer" title="Copy ID">
                  <Copy className="h-4 w-4" />
                </button>
                {copied && <span className="text-xs text-accent">Copied!</span>}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {order.status}
                </span>
                <span className="text-sm text-white/50">Placed on {order.date}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleReorder}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent text-primary text-xs font-bold rounded-xl hover:brightness-95 transition-all cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {reordered ? "Added to Cart!" : "Reorder"}
              </button>
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-white/20 text-white text-xs font-semibold rounded-xl hover:bg-white/10 transition-all cursor-pointer min-h-[44px]"
              >
                <Download className="h-3.5 w-3.5" /> Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — tracking + items */}
          <div className="lg:col-span-2 space-y-5">
            <TrackingTimeline status={order.status} />
            <ItemsList items={order.items} />

            {isDelivered && (
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-primary">How was your order?</p>
                  <p className="text-xs text-muted mt-0.5">Rate your experience and help others decide.</p>
                </div>
                <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-accent text-primary text-xs font-bold rounded-xl hover:brightness-95 transition-all cursor-pointer min-h-[44px]">
                  <Star className="h-3.5 w-3.5" /> Rate Order
                </button>
              </div>
            )}

            {canCancel && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {!cancelConfirm ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">Need to cancel?</p>
                      <p className="text-xs text-muted mt-0.5">Cancel before shipping for a full refund.</p>
                    </div>
                    <button
                      onClick={() => setCancelConfirm(true)}
                      className="flex-shrink-0 px-4 py-2.5 border border-red-200 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50 transition-all cursor-pointer min-h-[44px]"
                    >
                      Cancel Order
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary">Are you sure?</p>
                      <p className="text-xs text-muted mt-0.5">This will cancel all items in this order.</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setCancelConfirm(false)} className="px-4 py-2.5 border border-gray-200 text-sm font-medium text-primary rounded-xl hover:bg-gray-50 transition-all cursor-pointer min-h-[44px]">
                        Keep Order
                      </button>
                      <button
                        onClick={() => cancelOrder("Cancelled by customer")}
                        className="px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-all cursor-pointer min-h-[44px]"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — summary + address + support */}
          <div className="space-y-5">
            <PaymentSummary order={order} />
            <ShippingAddress address={order.address} />

            <div className="bg-primary rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-accent" />
                <p className="text-sm font-bold text-white">Need Help?</p>
              </div>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Our support team is available 24/7 for order queries, returns, and replacements.
              </p>
              <div className="space-y-2">
                <Link href="/help" className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors min-h-[44px]">
                  <span>Help Center</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <button className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer min-h-[44px]">
                  <span>Report an Issue</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
