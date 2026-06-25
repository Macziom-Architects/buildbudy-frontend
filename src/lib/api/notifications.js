import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPut, apiDelete } from "./client";

// ─── Mock seed ─────────────────────────────────────────────────────────────────

const SEED = [
  { id: 1,  type: "order",   read: false, title: "Order Delivered!", message: "BB-20240312-1892 has been delivered successfully.", time: "2 hours ago", timeRaw: 2,    href: "/orders/BB-20240312-1892" },
  { id: 2,  type: "offer",   read: false, title: "Flash Sale: Power Tools — 40% Off", message: "Bosch, Makita, Stanley. Limited stock!", time: "3 hours ago", timeRaw: 3,    href: "/products" },
  { id: 3,  type: "service", read: false, title: "Service Booking Confirmed", message: "Plumbing service confirmed for tomorrow 10 AM.", time: "5 hours ago", timeRaw: 5,    href: "/services/booking-success" },
  { id: 4,  type: "order",   read: false, title: "Order Shipped", message: "BB-20240228-0741 is on its way!", time: "1 day ago", timeRaw: 24,   href: "/orders/BB-20240228-0741" },
  { id: 5,  type: "diy",     read: false, title: "New Guide: Monsoon-Proofing", message: "Waterproof your home before the rains.", time: "1 day ago", timeRaw: 26,   href: "/diy/monsoon-proof-home" },
  { id: 6,  type: "payment", read: true,  title: "Payment Successful", message: "₹2,349 via UPI for order BB-20240312-1892.", time: "2 days ago", timeRaw: 48,   href: "/orders/BB-20240312-1892" },
  { id: 7,  type: "offer",   read: true,  title: "20% Off Asian Paints This Weekend", message: "Tractor Emulsion, Royale, Apcolite.", time: "3 days ago", timeRaw: 72,   href: "/products" },
  { id: 8,  type: "order",   read: true,  title: "Order Packed", message: "BB-20240219-3301 packed and ready to dispatch.", time: "3 days ago", timeRaw: 74,   href: "/orders/BB-20240219-3301" },
  { id: 9,  type: "service", read: true,  title: "Service Reminder", message: "Electrical inspection scheduled next Monday 10 AM.", time: "4 days ago", timeRaw: 96,   href: "/services" },
  { id: 10, type: "diy",     read: true,  title: "Guide Bookmarked", message: "\"Paint Like a Pro\" saved to bookmarks.", time: "5 days ago", timeRaw: 120,  href: "/diy/1" },
  { id: 11, type: "account", read: true,  title: "Profile Updated", message: "Your account information was updated.", time: "1 week ago", timeRaw: 168,  href: "/profile" },
  { id: 12, type: "account", read: true,  title: "Welcome to BuildBudy!", message: "Explore services, products, and DIY guides.", time: "2 months ago", timeRaw: 1440, href: "/" },
];

const LS_KEY = "bb_notifications";

function loadMock() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

function saveMock(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

// ─── Notifications API ─────────────────────────────────────────────────────────

/**
 * Fetch all notifications for the current user.
 * Filters: { type?, unreadOnly? }
 * Returns Notification[].
 */
export async function getNotifications(filters = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let list = loadMock();
    if (filters.type && filters.type !== "all") {
      list = list.filter((n) => n.type === filters.type);
    }
    if (filters.unreadOnly) {
      list = list.filter((n) => !n.read);
    }
    return list;
  }
  return apiGet("/notifications", filters);
}

/**
 * Mark a single notification as read.
 */
export async function markRead(id) {
  if (USE_MOCK) {
    await delay(0);
    const list = loadMock().map((n) => (n.id === id ? { ...n, read: true } : n));
    saveMock(list);
    return { ok: true };
  }
  return apiPut(`/notifications/${id}/read`, {});
}

/**
 * Mark all notifications as read.
 */
export async function markAllRead() {
  if (USE_MOCK) {
    await delay(0);
    const list = loadMock().map((n) => ({ ...n, read: true }));
    saveMock(list);
    return { ok: true };
  }
  return apiPut("/notifications/read-all", {});
}

/**
 * Delete a notification.
 */
export async function deleteNotification(id) {
  if (USE_MOCK) {
    await delay(0);
    const list = loadMock().filter((n) => n.id !== id);
    saveMock(list);
    return { ok: true };
  }
  return apiDelete(`/notifications/${id}`);
}

/**
 * Return the unread count without fetching full list.
 * Used for badge counts in navbar / profile.
 */
export async function getUnreadCount() {
  if (USE_MOCK) {
    return loadMock().filter((n) => !n.read).length;
  }
  const data = await apiGet("/notifications/unread-count");
  return data.count ?? 0;
}
