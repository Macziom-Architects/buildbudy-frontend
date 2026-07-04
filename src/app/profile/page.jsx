"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, MapPin, ShoppingBag, Heart, CreditCard, Settings,
  LogOut, ChevronRight, Plus, Edit2, Trash2, Shield,
  Package, Clock, Truck, Home, Bell,
  Phone, Camera, Loader2, Building2, ArrowRight,
  Tag, BookOpen, Wrench, CheckCircle2, XCircle,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import { IMAGE_FALLBACK_SRC } from "@/components/ui/SafeImage";
import AddressFormModal from "@/components/shared/AddressFormModal";
import { useSelectedAddress } from "@/hooks/useSelectedAddress";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useFetch } from "@/hooks/useFetch";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { STATUS_CONFIG } from "@/lib/ordersData";
import {
  getAddresses,
  createAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress,
} from "@/lib/api/addresses";
import {
  getNotifications,
  getUnreadCount as fetchUnreadCount,
} from "@/lib/api/notifications";
// ─── Constants ─────────────────────────────────────────────────────────────────

function handleImgError(e) {
  if (e.currentTarget.src.endsWith(IMAGE_FALLBACK_SRC)) return;
  e.currentTarget.src = IMAGE_FALLBACK_SRC;
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

function OrdersSection({ orders, total, loading }) {
  const recent = orders.slice(0, 3);

  if (loading) {
    return (
      <SectionWrapper title="My Orders" subtitle="Loading…">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-16 flex-shrink-0" />
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (recent.length === 0) {
    return (
      <SectionWrapper title="My Orders" subtitle="0 orders placed">
        <div className="flex flex-col items-center py-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <ShoppingBag className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-primary mb-1">No orders yet</p>
          <p className="text-xs text-muted mb-4">Your order history will appear here once you place an order.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      title="My Orders"
      subtitle={`${total} order${total !== 1 ? "s" : ""} placed`}
      action={
        <Link href="/orders" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
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
                  <span className="text-xs font-bold text-primary font-mono">{order.id}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-muted truncate">{order.items.map((i) => i.name).join(", ")}</p>
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
    </SectionWrapper>
  );
}

// ─── Wishlist section (frontend-only, backed by WishlistContext) ─────────────────

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
                ? <img src={product.image} alt={product.name} onError={handleImgError} className="h-full w-full object-cover" />
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
  const [modal, setModal] = useState(null);
  const { data, loading, error, refetch } = useFetch(getAddresses, []);
  const addresses = data ?? [];
  const { selectedAddress, selectAddress, clearSelection } = useSelectedAddress();

  async function handleSave(form) {
    const saved = form.id
      ? await apiUpdateAddress(form.id, form)
      : await createAddress(form);
    await refetch();
    // Keep the navbar/checkout selection in sync when the edited/created
    // address is the one currently selected (or becomes the new default).
    if (saved?.isDefault || selectedAddress?.id === saved?.id) {
      selectAddress(saved);
    }
  }

  async function handleDelete(id) {
    await apiDeleteAddress(id);
    await refetch();
    if (selectedAddress?.id === String(id)) {
      const remaining = await getAddresses();
      const next = remaining.find((a) => a.isDefault) ?? remaining[0] ?? null;
      if (next) selectAddress(next);
      else clearSelection();
    }
  }

  async function handleSetDefault(id) {
    await setDefaultAddress(id);
    await refetch();
    const updated = await getAddresses();
    const newDefault = updated.find((a) => a.id === String(id));
    if (newDefault) selectAddress(newDefault);
  }

  if (loading) {
    return (
      <SectionWrapper title="Saved Addresses" subtitle="Manage your delivery addresses">
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-full max-w-[200px]" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper title="Saved Addresses" subtitle="Manage your delivery addresses">
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm text-red-500 mb-3">Failed to load addresses.</p>
          <button onClick={refetch} className="text-xs font-semibold text-accent hover:underline cursor-pointer">
            Try again
          </button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <>
      {modal !== null && (
        <AddressFormModal
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
                  {addr.label === "Home"
                    ? <Home className="h-3.5 w-3.5 text-primary" />
                    : addr.label === "Office"
                      ? <Building2 className="h-3.5 w-3.5 text-primary" />
                      : <MapPin className="h-3.5 w-3.5 text-primary" />
                  }
                </div>
                <span className="text-sm font-bold text-primary">{addr.label}</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{addr.name}</p>
              <p className="text-xs text-muted mt-1">{addr.line1}</p>
              {addr.line2 && <p className="text-xs text-muted">{addr.line2}</p>}
              <p className="text-xs text-muted">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-xs text-muted mt-1">{addr.phone}</p>
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
      </SectionWrapper>
    </>
  );
}

// ─── Notifications section (API-backed, placeholder for backend push) ────────────

const NOTIF_TYPE_CONFIG = {
  order:   { icon: Package,    bg: "bg-blue-50",    text: "text-blue-600"    },
  offer:   { icon: Tag,        bg: "bg-accent/10",  text: "text-amber-600"   },
  diy:     { icon: BookOpen,   bg: "bg-emerald-50", text: "text-emerald-600" },
  service: { icon: Wrench,     bg: "bg-violet-50",  text: "text-violet-600"  },
  payment: { icon: CreditCard, bg: "bg-teal-50",    text: "text-teal-600"    },
  account: { icon: Shield,     bg: "bg-gray-100",   text: "text-gray-600"    },
};

function NotificationsSection() {
  const { data, loading } = useFetch(() => getNotifications(), []);
  const notifs = data ?? [];
  const recent = notifs.slice(0, 5);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <SectionWrapper
      title="Notifications"
      subtitle={loading ? "Loading…" : unread > 0 ? `${unread} unread` : "All caught up"}
      action={
        <Link href="/notifications" className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
              <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
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

// ─── Saved Payments section (frontend placeholder) ──────────────────────────────

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

function SettingsSection({ user, onUpdateProfile }) {
  const [form, setForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, push: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form when the fetched user profile arrives
    if (user) setForm({ name: user.name ?? "", phone: user.phone ?? "" });
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdateProfile({ name: form.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
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
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={form.phone}
                readOnly
                title="Mobile number is verified and cannot be changed here"
                className={`${inputCls} bg-gray-50 cursor-not-allowed`}
              />
            </div>
            <p className="text-[11px] text-muted mt-1 flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-500" /> Verified number — contact support to change
            </p>
          </div>
        </div>
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
            { key: "sms",  label: "SMS Alerts",         sub: "Delivery updates and OTP messages" },
            { key: "push", label: "Push Notifications", sub: "Browser and app alerts" },
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

      <SectionWrapper title="Security" subtitle="Manage your account security">
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary">Mobile OTP Verified</p>
              <p className="text-xs text-muted">Your account is secured with mobile OTP authentication</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          </div>
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
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const { isLoggedIn, user, logout, updateProfile, loading: authLoading } = useAuth();
  const { orders, total: ordersTotal, loading: ordersLoading } = useOrders();
  const { wishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchUnreadCount()
      .then((count) => setUnreadCount(typeof count === "number" ? count : 0))
      .catch(() => {});
  }, [isLoggedIn]);

  const SIDEBAR_ITEMS = useMemo(() => [
    { id: "orders",        label: "My Orders",        icon: ShoppingBag, badge: ordersTotal > 0 ? ordersTotal : null },
    { id: "addresses",     label: "Saved Addresses",  icon: MapPin       },
    { id: "wishlist",      label: "Wishlist",          icon: Heart,       badge: wishlist.length > 0 ? wishlist.length : null },
    { id: "notifications", label: "Notifications",    icon: Bell,        badge: unreadCount > 0 ? unreadCount : null },
    { id: "payments",      label: "Saved Payments",   icon: CreditCard   },
    { id: "settings",      label: "Account Settings", icon: Settings     },
  ], [ordersTotal, wishlist.length, unreadCount]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/auth/login");
  }, [logout, router]);

  const renderSection = () => {
    switch (activeSection) {
      case "orders":        return <OrdersSection orders={orders} total={ordersTotal} loading={ordersLoading} />;
      case "addresses":     return <AddressesSection />;
      case "wishlist":      return <WishlistSection />;
      case "notifications": return <NotificationsSection />;
      case "payments":      return <PaymentsSection />;
      case "settings":      return <SettingsSection user={user} onUpdateProfile={updateProfile} />;
      default:              return null;
    }
  };

  const displayName    = user?.name        ?? "BuildBudy User";
  const displayPhone   = user?.phone       ?? "";
  const displaySince   = user?.memberSince ?? "";
  const initials       = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "BB";

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6FA]">

      {/* ── Profile header ──────────────────────────────────────────── */}
      <div className="bg-primary px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          {authLoading ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0 bg-white/20" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48 bg-white/20" />
                <Skeleton className="h-4 w-64 bg-white/10" />
              </div>
              <div className="flex gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center space-y-1.5">
                    <Skeleton className="h-6 w-8 mx-auto bg-white/20" />
                    <Skeleton className="h-3 w-14 bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-accent/20 flex items-center justify-center border-2 border-accent/30">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" onError={handleImgError} className="h-full w-full object-cover rounded-2xl" />
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
                <h1 className="text-xl font-bold text-white">{displayName}</h1>
                <p className="text-sm text-white/60 mt-0.5">BuildBudy Member</p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5">
                  {displayPhone && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                      <Phone className="h-3 w-3" /> {displayPhone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <Shield className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Verified</span>
                  </span>
                  {displaySince && <span className="text-xs text-white/40">Member since {displaySince}</span>}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-5 flex-shrink-0">
                {[
                  { label: "Orders",   value: ordersTotal,      section: "orders"        },
                  { label: "Wishlist", value: wishlist.length,  section: "wishlist"      },
                  { label: "Alerts",   value: unreadCount,      section: "notifications" },
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
          )}
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
