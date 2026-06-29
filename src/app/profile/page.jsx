"use client";

import { useState, useSyncExternalStore, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, MapPin, ShoppingBag, Heart, CreditCard, Settings,
  LogOut, ChevronRight, Plus, Edit2, Trash2, Shield,
  Package, CheckCircle, Clock, Truck, Home, Bell,
  Phone, Mail, Camera, X, Loader2, Building2, ArrowRight,
  Star, Tag, BookOpen, Wrench, AlertCircle, CheckCircle2,
  XCircle, Calendar,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { STATUS_CONFIG } from "@/lib/ordersData";
import { getProfile, updateProfile } from "@/lib/api/auth";
import { getOrders } from "@/lib/api/orders";
import {
  listAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress,
} from "@/lib/api/addresses";
import { Suspense } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  name: "Ravi Kumar",
  email: "ravi.kumar@example.com",
  phone: "+91 98765 43210",
  avatar: null,
  memberSince: "Jan 2024",
};

// Map the backend user ({ fullName, email, phoneNumber, createdAt, ... }) to the
// shape this page renders ({ name, email, phone, avatar, memberSince }).
function mapApiUser(api) {
  if (!api) return MOCK_USER;
  return {
    name: api.fullName || "",
    email: api.email || "",
    phone: api.phoneNumber || "",
    avatar: api.avatarUrl || null,
    memberSince: api.createdAt
      ? new Date(api.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
      : "",
  };
}

// ─── Address Modal ──────────────────────────────────────────────────────────────

const LABEL_OPTIONS = ["Home", "Office", "Other"];

function AddressModal({ address, onClose, onSave }) {
  const blank = {
    label: "Home", line1: "", line2: "", pincode: "", isDefault: false,
  };
  const [form, setForm] = useState(address ? { ...address } : blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function field(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.message || "Could not save address. Please try again.");
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
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Flat / House / Building</label>
            <input value={form.line1} onChange={field("line1")} required placeholder="Flat no, Building name" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Area / Street</label>
            <input value={form.line2} onChange={field("line2")} placeholder="Street, Area, Locality" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Pincode</label>
            <input value={form.pincode} onChange={field("pincode")} required placeholder="201301" maxLength={6} pattern="\d{6}" className={inputCls} />
            <p className="text-[11px] text-muted mt-1.5">City &amp; state are detected automatically from your pincode.</p>
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
          {error && (
            <p className="text-xs font-medium text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
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

// ─── Section shell ──────────────────────────────────────────────────────────────

function SectionWrapper({ title, subtitle, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Orders section ─────────────────────────────────────────────────────────────

const ORDER_STATUS_ICONS = {
  "Placed":           Clock,
  "Packed":           Package,
  "Shipped":          Truck,
  "Out for Delivery": Truck,
  "Delivered":        CheckCircle2,
  "Cancelled":        XCircle,
};

function OrdersSection({ orders, loading }) {
  const recent = orders.slice(0, 3);

  return (
    <SectionWrapper
      title="My Orders"
      subtitle={loading ? "Loading…" : `${orders.length} order${orders.length === 1 ? "" : "s"} placed`}
      action={
        <Link href="/orders" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <ShoppingBag className="h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-primary mb-1">No orders yet</p>
          <p className="text-xs text-muted mb-4">Your placed orders will show up here.</p>
          <Link href="/products" className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
            Start shopping →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {recent.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Placed"];
              const StatusIcon = ORDER_STATUS_ICONS[order.status] ?? Package;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <StatusIcon className={`h-4.5 w-4.5 ${cfg.color}`} style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-primary font-mono">{order.orderNumber ?? order.id}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}{order.date ? ` · ${order.date}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">₹{order.total.toLocaleString("en-IN")}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:border-primary hover:bg-gray-50 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              View All Orders
            </Link>
          </div>
        </>
      )}
    </SectionWrapper>
  );
}

// ─── Wishlist section ────────────────────────────────────────────────────────────

function WishlistSection() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, showToast } = useCart();

  function handleMoveToCart(product) {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`${product.name.split(" ").slice(0, 3).join(" ")} added to cart`);
  }

  if (wishlist.length === 0) {
    return (
      <SectionWrapper
        title="Wishlist"
        subtitle="Products you've saved"
        action={
          <Link href="/wishlist" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="flex flex-col items-center py-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Heart className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-primary mb-1">Your wishlist is empty</p>
          <p className="text-xs text-muted mb-4">Save products you love and shop them anytime.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  const shown = wishlist.slice(0, 4);
  const remaining = wishlist.length - shown.length;

  return (
    <SectionWrapper
      title="Wishlist"
      subtitle={`${wishlist.length} saved item${wishlist.length !== 1 ? "s" : ""}`}
      action={
        <Link href="/wishlist" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="space-y-3">
        {shown.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {product.image
                ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                : <Package className="h-5 w-5 text-gray-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary leading-snug truncate">{product.name}</p>
              <p className="text-sm font-bold text-primary mt-0.5">₹{(product.price ?? 0).toLocaleString("en-IN")}</p>
            </div>
            <button
              onClick={() => handleMoveToCart(product)}
              className="flex-shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        ))}
        {remaining > 0 && (
          <Link href="/wishlist" className="block text-center text-xs font-semibold text-accent py-2 hover:text-accent/80 transition-colors">
            +{remaining} more item{remaining !== 1 ? "s" : ""} →
          </Link>
        )}
      </div>
    </SectionWrapper>
  );
}

// ─── Addresses section ──────────────────────────────────────────────────────────

function AddressesSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const refresh = useCallback(async () => {
    const list = await listAddresses();
    setAddresses(list);
    return list;
  }, []);

  useEffect(() => {
    let active = true;
    listAddresses()
      .then((list) => { if (active) setAddresses(list); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Throws on failure so the modal can surface the error (e.g. unserviceable pincode).
  async function handleSave(form) {
    if (form.id) await updateAddress(form.id, form);
    else await createAddress(form);
    await refresh();
  }

  async function handleDelete(id) {
    await deleteAddress(id);
    await refresh();
  }

  async function handleSetDefault(id) {
    await setDefaultAddress(id);
    await refresh();
  }

  return (
    <>
      {modal !== null && (
        <AddressModal
          address={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      <SectionWrapper
        title="Saved Addresses"
        subtitle="Manage your delivery addresses"
        action={
          <button onClick={() => setModal("add")} className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add New
          </button>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses…
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="relative p-4 rounded-xl border-2 hover:shadow-md transition-all duration-200"
                style={{ borderColor: addr.isDefault ? "#F0C12D" : "#f3f4f6" }}
              >
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-accent text-primary px-2 py-0.5 rounded-full">Default</span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    {addr.label === "Home" ? <Home className="h-3.5 w-3.5 text-primary" /> : addr.label === "Office" ? <Building2 className="h-3.5 w-3.5 text-primary" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <span className="text-sm font-bold text-primary">{addr.label}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{addr.line1}</p>
                {addr.line2 && <p className="text-xs text-muted mt-0.5">{addr.line2}</p>}
                <p className="text-xs text-muted mt-0.5">{addr.city}, {addr.state} — {addr.pincode}</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => setModal(addr)} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-accent transition-colors cursor-pointer">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  {!addr.isDefault && (
                    <>
                      <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-xs font-medium text-muted hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                      <button onClick={() => handleSetDefault(addr.id)} className="ml-auto text-xs font-medium text-accent hover:text-accent/80 transition-colors cursor-pointer">
                        Set Default
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => setModal("add")}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer group min-h-[160px]"
            >
              <div className="h-10 w-10 rounded-full bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <Plus className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Add New Address</span>
            </button>
          </div>
        )}
      </SectionWrapper>
    </>
  );
}

// ─── Notifications section ──────────────────────────────────────────────────────

const NOTIF_TYPE_CONFIG = {
  order:   { icon: Package,    bg: "bg-blue-50",    text: "text-blue-600"    },
  offer:   { icon: Tag,        bg: "bg-accent/10",  text: "text-amber-600"   },
  diy:     { icon: BookOpen,   bg: "bg-emerald-50", text: "text-emerald-600" },
  service: { icon: Wrench,     bg: "bg-violet-50",  text: "text-violet-600"  },
  payment: { icon: CreditCard, bg: "bg-teal-50",    text: "text-teal-600"    },
  account: { icon: Shield,     bg: "bg-gray-100",   text: "text-gray-600"    },
};

function NotificationsSection() {
  // Notifications have no backend yet (deferred — MSG91/D4 on hold), so there is no
  // live data to show. Render the honest empty state instead of mock seeds.
  const [notifs] = useState([]);

  const recent = notifs.slice(0, 5);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <SectionWrapper
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
      action={
        <Link href="/notifications" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {recent.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Bell className="h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-primary mb-1">No notifications</p>
          <p className="text-xs text-muted">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recent.map((n) => {
            const cfg = NOTIF_TYPE_CONFIG[n.type] ?? NOTIF_TYPE_CONFIG.account;
            const Icon = cfg.icon;
            return (
              <Link
                key={n.id}
                href={n.href ?? "/notifications"}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                  n.read ? "border-gray-100 hover:border-gray-200" : "border-blue-100 bg-blue-50/30 hover:border-blue-200"
                }`}
              >
                <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug truncate ${n.read ? "font-medium text-gray-700" : "font-bold text-primary"}`}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1.5" />}
              </Link>
            );
          })}
          <Link
            href="/notifications"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-primary hover:border-primary hover:bg-gray-50 transition-all mt-1"
          >
            <Bell className="h-3.5 w-3.5" />
            View All Notifications
          </Link>
        </div>
      )}
    </SectionWrapper>
  );
}

// ─── Saved Payments section ─────────────────────────────────────────────────────

function PaymentsSection() {
  return (
    <SectionWrapper title="Saved Payments" subtitle="Manage payment methods for faster checkout">
      <div className="flex flex-col items-center py-10 text-center">
        <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <CreditCard className="h-7 w-7 text-gray-300" />
        </div>
        <p className="text-sm font-bold text-primary mb-1">No saved payment methods</p>
        <p className="text-xs text-muted mb-5 max-w-xs">Add UPI IDs, debit/credit cards, or wallets for faster checkout.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["UPI", "Debit Card", "Credit Card", "Wallet"].map((m) => (
            <button key={m} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all cursor-pointer">
              <Plus className="h-3 w-3" /> {m}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Settings section ───────────────────────────────────────────────────────────

function SettingsSection() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", avatar: null, memberSince: "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: false });

  useEffect(() => {
    getProfile().then((u) => setUser(mapApiUser(u))).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      // Backend PATCH /users/me accepts fullName + email; phone is the login
      // identity and is not editable here.
      const updated = await updateProfile({ fullName: user.name, email: user.email });
      setUser(mapApiUser(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      // e.g. 400 "This email is already in use"
      setError(err?.message || "Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all";

  return (
    <div className="space-y-5">
      <SectionWrapper title="Personal Information" subtitle="Update your profile details">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={user.name} onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={user.email} onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))} type="email" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={user.phone} readOnly disabled className={`${inputCls} bg-gray-50 text-muted cursor-not-allowed`} />
            </div>
            <p className="text-[11px] text-muted mt-1">Phone number is your login ID and can&apos;t be changed.</p>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
        )}
        <div className="mt-5 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
          {saved && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Notification Preferences" subtitle="Choose how you hear from us">
        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", sub: "Order updates, promotions, and newsletters" },
            { key: "sms",   label: "SMS Alerts",          sub: "Delivery updates and OTP messages" },
            { key: "push",  label: "Push Notifications",  sub: "Browser and app alerts" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{label}</p>
                <p className="text-xs text-muted">{sub}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${notifications[key] ? "bg-primary" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Security" subtitle="Manage your password and account security">
        <div className="space-y-3">
          {[
            { icon: Shield, label: "Two-Factor Authentication", sub: "Add an extra layer of security",  href: null },
          ].map(({ icon: Icon, label, sub, href }) => {
            const Wrapper = href ? Link : "button";
            return (
              <Wrapper
                key={label}
                {...(href ? { href } : {})}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{label}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
              </Wrapper>
            );
          })}
        </div>
      </SectionWrapper>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ─────────────────────────────────────────

function ProfilePageInner() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section") ?? "orders";
  const [activeSection, setActiveSection] = useState(initialSection);
  const [user, setUser] = useState({ name: "", email: "", phone: "", avatar: null, memberSince: "" });
  const [orders, setOrders] = useState(null); // null = loading; shared by badge, stat, and OrdersSection
  const [unreadCount] = useState(0); // notifications backend deferred — no unread to show yet
  const router = useRouter();
  const { wishlist } = useWishlist();

  const isLoggedIn = useSyncExternalStore(
    (cb) => { window.addEventListener("storage", cb); return () => window.removeEventListener("storage", cb); },
    () => !!localStorage.getItem("bb_logged_in"),
    () => false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
      return;
    }
    getProfile()
      .then((u) => setUser(mapApiUser(u)))
      .catch(() => {});
    getOrders()
      .then((res) => setOrders(res.orders ?? []))
      .catch(() => setOrders([]));
  }, [router]);

  const SIDEBAR_ITEMS = useMemo(() => [
    { id: "orders",        label: "My Orders",       icon: ShoppingBag, badge: orders && orders.length > 0 ? orders.length : null },
    { id: "addresses",     label: "Saved Addresses", icon: MapPin       },
    { id: "wishlist",      label: "Wishlist",         icon: Heart,       badge: wishlist.length > 0 ? wishlist.length : null },
    { id: "notifications", label: "Notifications",   icon: Bell,        badge: unreadCount > 0 ? unreadCount : null },
    { id: "payments",      label: "Saved Payments",  icon: CreditCard   },
    { id: "settings",      label: "Account Settings", icon: Settings    },
  ], [orders, wishlist.length, unreadCount]);

  const handleLogout = () => {
    localStorage.removeItem("bb_logged_in");
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":        return <OrdersSection orders={orders ?? []} loading={orders === null} />;
      case "addresses":     return <AddressesSection />;
      case "wishlist":      return <WishlistSection />;
      case "notifications": return <NotificationsSection />;
      case "payments":      return <PaymentsSection />;
      case "settings":      return <SettingsSection />;
      default:              return null;
    }
  };

  const initials = (user.name || "").split(" ").map((n) => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6FA]">

      {/* ── Profile header ──────────────────────────────────────────── */}
      <div className="bg-primary px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-accent/20 flex items-center justify-center border-2 border-accent/30">
                {user.avatar
                  ? <img src={user.avatar} alt="" className="h-full w-full object-cover rounded-2xl" />
                  : <span className="text-2xl font-bold text-accent">{initials}</span>
                }
              </div>
              <button
                onClick={() => setActiveSection("settings")}
                className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-accent text-primary flex items-center justify-center shadow-md hover:bg-accent/90 transition-colors cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="text-sm text-white/60 mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                {user.phone && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                    <Phone className="h-3 w-3" /> {user.phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Verified</span>
                </span>
                {user.memberSince && <span className="text-xs text-white/40">Member since {user.memberSince}</span>}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-5 flex-shrink-0">
              {[
                { label: "Orders",   value: orders?.length ?? 0, section: "orders"    },
                { label: "Wishlist", value: wishlist.length,    section: "wishlist"  },
                { label: "Alerts",   value: unreadCount,        section: "notifications" },
              ].map(({ label, value, section }) => (
                <button
                  key={label}
                  onClick={() => setActiveSection(section)}
                  className="text-center cursor-pointer group"
                >
                  <p className="text-xl font-bold text-white group-hover:text-accent transition-colors">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <nav className="p-2">
                {SIDEBAR_ITEMS.map(({ id, label, icon: Icon, badge }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer group ${
                      activeSection === id
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge != null && badge > 0 && (
                      <span className={`text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center ${
                        activeSection === id ? "bg-white/20 text-white" : "bg-accent/20 text-accent"
                      }`}>
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                    {activeSection !== id && <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />}
                  </button>
                ))}
              </nav>
              <div className="px-2 pb-2 border-t border-gray-100 mt-1 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Help card */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-xs font-bold text-primary mb-1">Need Help?</p>
              <p className="text-xs text-muted mb-3">Our support team is available 24/7</p>
              <div className="space-y-2">
                <Link href="/help" className="block text-xs font-semibold text-accent hover:underline cursor-pointer">
                  Help Center →
                </Link>
                <Link href="/orders" className="block text-xs font-semibold text-primary/60 hover:text-primary cursor-pointer">
                  Track an Order →
                </Link>
              </div>
            </div>
          </aside>

          {/* Section content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 lg:hidden">
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    activeSection === id
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-primary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {badge != null && badge > 0 && (
                    <span className={`text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ${
                      activeSection === id ? "bg-white/20 text-white" : "bg-accent text-primary"
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {renderSection()}
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

// ─── Page (Suspense wrapper for useSearchParams) ────────────────────────────────

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageInner />
    </Suspense>
  );
}
