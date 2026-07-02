"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag, Search, Package, Truck, CheckCircle2, Clock,
  XCircle, ChevronRight, ArrowLeft, RotateCcw, Receipt,
  Calendar, AlertCircle, X,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { OrderListSkeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";
import { useOrders } from "@/hooks/useOrders";
import { STATUS_CONFIG } from "@/lib/ordersData";

// ─── Status icon map ───────────────────────────────────────────────────────────

const STATUS_ICONS = {
  "Placed":           Clock,
  "Packed":           Package,
  "Shipped":          Truck,
  "Out for Delivery": Truck,
  "Delivered":        CheckCircle2,
  "Cancelled":        XCircle,
};

// ─── Filter tabs ───────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { id: "all",       label: "All Orders" },
  { id: "active",    label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

// ─── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Placed"];
  const Icon = STATUS_ICONS[order.status] ?? Package;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-4 sm:p-5 cursor-pointer"
    >
      {/* Status icon */}
      <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${cfg.bg}`}>
        <Icon className={`h-5 w-5 ${cfg.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-sm font-bold text-primary font-mono tracking-wide">{order.orderNumber ?? order.id}</span>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-700 truncate mb-1">
          {order.summary || order.items.map((i) => i.name).join(", ")}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {order.date}
          </span>
          {order.items.length > 0 && (
            <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
          )}
          {order.deliveryDate && order.status !== "Cancelled" && (
            <span className={order.status === "Delivered" ? "text-emerald-600 font-medium" : ""}>
              {order.status === "Delivered" ? `Delivered ${order.deliveryDate}` : `Expected by ${order.deliveryDate}`}
            </span>
          )}
          {order.cancelReason && (
            <span className="text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {order.cancelReason}
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 flex-shrink-0">
        <p className="text-base font-bold text-primary">₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:block text-xs font-medium text-muted group-hover:text-accent transition-colors">Details</span>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyOrders({ tab, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <ShoppingBag className="h-10 w-10 text-gray-300" />
      </div>
      <p className="text-base font-bold text-primary mb-1">
        {tab === "all" ? "No orders yet" : `No ${tab} orders`}
      </p>
      <p className="text-sm text-muted mb-6 max-w-xs">
        {tab === "all"
          ? "When you place an order it will appear here."
          : "Switch to a different filter to see your other orders."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {tab !== "all" && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 border border-gray-200 text-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" /> Clear Filter
          </button>
        )}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" /> Start Shopping
        </Link>
      </div>
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <p className="text-base font-bold text-primary mb-1">Failed to load orders</p>
      <p className="text-sm text-muted mb-5">Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" /> Retry
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [query, setQuery]       = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { orders, total, loading, error, refetch } = useOrders({
    status: activeTab,
    search: query || undefined,
  });

  // Client-side count per tab (uses unfiltered total from the same hook re-used with "all")
  // For badges we compute from all orders (once loaded)
  const { orders: allOrders } = useOrders({ status: "all" });

  const tabCounts = useMemo(() => {
    const active = ["Placed", "Packed", "Shipped", "Out for Delivery"];
    return {
      all:       allOrders.length,
      active:    allOrders.filter((o) => active.includes(o.status)).length,
      delivered: allOrders.filter((o) => o.status === "Delivered").length,
      cancelled: allOrders.filter((o) => o.status === "Cancelled").length,
    };
  }, [allOrders]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors mb-5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {loading ? (
              <PageHeaderSkeleton />
            ) : (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">BuildBudy Account</p>
                <h1 className="text-2xl font-bold text-white">My Orders</h1>
                <p className="text-sm text-white/50 mt-1">{total} order{total !== 1 ? "s" : ""} placed</p>
              </div>
            )}
            <Link href="/products" className="flex-shrink-0 inline-flex items-center gap-2 bg-accent text-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:brightness-95 transition-all">
              <ShoppingBag className="h-4 w-4" /> Shop Again
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Search ─────────────────────────────────────────────── */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or product name…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 shadow-sm transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* ── Filter tabs ────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {label}
              <span className={`text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ${
                activeTab === id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tabCounts[id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        {loading ? (
          <OrderListSkeleton count={4} />
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : orders.length === 0 ? (
          <EmptyOrders tab={activeTab} onClear={() => { setActiveTab("all"); setQuery(""); }} />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* ── Help strip ─────────────────────────────────────────── */}
        {!loading && (
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Receipt className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">Need help with an order?</p>
              <p className="text-xs text-muted mt-0.5">Our support team can help with returns, replacements, and payment queries.</p>
            </div>
            <Link href="/help" className="flex-shrink-0 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-primary hover:border-primary hover:bg-gray-50 transition-all min-h-[44px] flex items-center">
              Get Help
            </Link>
          </div>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
