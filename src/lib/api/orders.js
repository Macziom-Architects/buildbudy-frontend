import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPut } from "./client";
import { MOCK_ORDERS } from "@/lib/ordersData";

// ─── API → UI shape mappers ──────────────────────────────────────────────────────
// Backend `GET /orders` returns { items, page, limit, total } with money in paise and
// a lowercase status enum; map it onto the title-case status + rupee fields the UI uses.

const ORDER_STATUS_MAP = {
  pending: "Placed",
  confirmed: "Packed",
  partially_delivered: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function mapApiOrder(raw) {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: ORDER_STATUS_MAP[raw.status] ?? "Placed",
    total: (raw.totalPaise ?? 0) / 100,
    itemCount: raw.itemCount ?? 0,
    placedAt: raw.placedAt,
    date: raw.placedAt
      ? new Date(raw.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "",
  };
}

// ─── Orders API ────────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's order history.
 * Filters: { status?, search?, page?, pageSize? }
 * Returns { orders: Order[], total: number }
 */
export async function getOrders(filters = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let orders = [...MOCK_ORDERS];

    if (filters.status && filters.status !== "all") {
      const active = ["Placed", "Packed", "Shipped", "Out for Delivery"];
      if (filters.status === "active") {
        orders = orders.filter((o) => active.includes(o.status));
      } else if (filters.status === "delivered") {
        orders = orders.filter((o) => o.status === "Delivered");
      } else if (filters.status === "cancelled") {
        orders = orders.filter((o) => o.status === "Cancelled");
      }
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    return { orders, total: orders.length };
  }

  const res = await apiGet("/orders", filters);
  const orders = (res?.items ?? []).map(mapApiOrder);
  return { orders, total: res?.total ?? orders.length };
}

/**
 * Fetch a single order by ID.
 * Returns Order | null.
 */
export async function getOrderById(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return MOCK_ORDERS.find((o) => o.id === id) ?? null;
  }
  return apiGet(`/orders/${encodeURIComponent(id)}`);
}

/**
 * Cancel an order.
 * Returns the updated Order.
 */
export async function cancelOrder(id, { reason } = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { id, status: "Cancelled", cancelReason: reason ?? "Cancelled by customer" };
  }
  return apiPost(`/orders/${encodeURIComponent(id)}/cancel`, { reason });
}

/**
 * Re-order (add all items from a previous order to cart).
 * Returns { cartUpdated: true }.
 */
export async function reorder(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { cartUpdated: true };
  }
  return apiPost(`/orders/${encodeURIComponent(id)}/reorder`, {});
}

/**
 * Submit a rating for a delivered order.
 * Returns { ok: true }.
 */
export async function rateOrder(id, { rating, comment } = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { ok: true };
  }
  return apiPost(`/orders/${encodeURIComponent(id)}/rate`, { rating, comment });
}

/**
 * Fetch invoice URL for a delivered order.
 * Returns { url: string }.
 */
export async function getInvoiceUrl(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { url: null }; // invoice generation not available in mock
  }
  return apiGet(`/orders/${encodeURIComponent(id)}/invoice`);
}
