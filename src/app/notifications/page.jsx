"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell, BellOff, Package, Tag, BookOpen, Wrench, Shield,
  CreditCard, CheckCheck, ChevronRight, ArrowLeft, Trash2,
  Zap, AlertCircle, RotateCcw,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { NotificationListSkeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/hooks/useNotifications";

// ─── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  order:   { label: "Orders",   icon: Package,    bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400"    },
  offer:   { label: "Offers",   icon: Tag,        bg: "bg-accent/10",  text: "text-amber-600",   dot: "bg-accent"      },
  diy:     { label: "DIY",      icon: BookOpen,   bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  service: { label: "Services", icon: Wrench,     bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-400"  },
  payment: { label: "Payments", icon: CreditCard, bg: "bg-teal-50",    text: "text-teal-600",    dot: "bg-teal-400"    },
  account: { label: "Account",  icon: Shield,     bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400"    },
};

const FILTER_TABS = [
  { id: "all",     label: "All" },
  { id: "order",   label: "Orders" },
  { id: "offer",   label: "Offers" },
  { id: "diy",     label: "DIY" },
  { id: "service", label: "Services" },
  { id: "payment", label: "Payments" },
  { id: "account", label: "Account" },
];

const GROUP_ORDER = ["Today", "This Week", "Earlier"];

function getGroup(timeRaw) {
  if (timeRaw <= 24) return "Today";
  if (timeRaw <= 168) return "This Week";
  return "Earlier";
}

// ─── Notification card ─────────────────────────────────────────────────────────

function NotifCard({ notif, onRead, onDelete }) {
  const cfg  = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.account;
  const Icon = cfg.icon;

  return (
    <div className={`group relative flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
      notif.read
        ? "bg-white border-gray-100 hover:border-gray-200"
        : "bg-blue-50/30 border-blue-100 hover:border-blue-200"
    }`}>
      {!notif.read && (
        <div className="absolute top-4 right-12 h-2 w-2 rounded-full bg-blue-500" />
      )}

      <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
        <Icon className={`h-4.5 w-4.5 ${cfg.text}`} style={{ width: 18, height: 18 }} />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <p className={`text-sm leading-snug mb-0.5 ${notif.read ? "font-medium text-gray-700" : "font-bold text-primary"}`}>
          {notif.title}
        </p>
        <p className="text-xs text-muted leading-relaxed line-clamp-2">{notif.message}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-[11px] text-muted">{notif.time}</span>
          {notif.href && (
            <Link
              href={notif.href}
              onClick={() => !notif.read && onRead(notif.id)}
              className="text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              {notif.action ?? "View"} →
            </Link>
          )}
          {!notif.read && (
            <button onClick={() => onRead(notif.id)} className="text-[11px] text-muted hover:text-primary transition-colors cursor-pointer">
              Mark read
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(notif.id)}
        className="absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all cursor-pointer"
        title="Remove notification"
      >
        <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
}

// ─── Empty & error states ──────────────────────────────────────────────────────

function EmptyState({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <BellOff className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-base font-bold text-primary mb-1">No notifications</p>
      <p className="text-sm text-muted">
        {tab === "all" ? "You're all caught up!" : `No ${tab} notifications yet.`}
      </p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
      <p className="text-base font-bold text-primary mb-1">Failed to load</p>
      <p className="text-sm text-muted mb-5">Check your connection and try again.</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
        <RotateCcw className="h-4 w-4" /> Retry
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    deleteNotification,
    refetch,
  } = useNotifications({ type: activeTab === "all" ? undefined : activeTab });

  const filtered = useMemo(() => {
    return [...notifications].sort((a, b) => a.timeRaw - b.timeRaw);
  }, [notifications]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((n) => {
      const g = getGroup(n.timeRaw);
      if (!groups[g]) groups[g] = [];
      groups[g].push(n);
    });
    return groups;
  }, [filtered]);

  // Tab unread counts (computed from full set re-fetched with "all")
  const { notifications: allNotifs } = useNotifications({});
  const tabUnread = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach(({ id }) => {
      counts[id] = id === "all"
        ? allNotifs.filter((n) => !n.read).length
        : allNotifs.filter((n) => n.type === id && !n.read).length;
    });
    return counts;
  }, [allNotifs]);

  const tabCounts = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach(({ id }) => {
      counts[id] = id === "all"
        ? allNotifs.length
        : allNotifs.filter((n) => n.type === id).length;
    });
    return counts;
  }, [allNotifs]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors mb-5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile
          </Link>
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">BuildBudy Account</p>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Bell className="h-6 w-6" />
                Notifications
                {unreadCount > 0 && (
                  <span className="text-sm font-bold bg-accent text-primary px-2.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 border border-white/20 text-white text-xs font-semibold rounded-xl hover:bg-white/10 transition-all cursor-pointer min-h-[44px]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filter tabs ────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTER_TABS.map(({ id, label }) => {
            const hasUnread = tabUnread[id] > 0;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                  activeTab === id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                {label}
                {tabCounts[id] > 0 && (
                  <span className={`text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ${
                    hasUnread       ? "bg-blue-500 text-white" :
                    activeTab === id ? "bg-white/20 text-white" :
                                       "bg-gray-100 text-gray-500"
                  }`}>
                    {hasUnread ? tabUnread[id] : tabCounts[id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        {loading ? (
          <NotificationListSkeleton count={5} />
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-8">
            {GROUP_ORDER.map((group) => {
              const items = grouped[group];
              if (!items?.length) return null;
              return (
                <div key={group}>
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{group}</p>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="space-y-2.5">
                    {items.map((n) => (
                      <NotifCard
                        key={n.id}
                        notif={n}
                        onRead={markRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Settings strip ──────────────────────────────────────── */}
        {!loading && (
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">Notification Preferences</p>
              <p className="text-xs text-muted mt-0.5">Choose which alerts you receive via email, SMS, or push.</p>
            </div>
            <Link
              href="/profile?section=settings"
              className="flex-shrink-0 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-primary hover:border-primary hover:bg-gray-50 transition-all min-h-[44px] flex items-center"
            >
              Settings
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
