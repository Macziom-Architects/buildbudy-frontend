import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPut } from "./client";
import { MOCK_ORDERS } from "@/lib/ordersData";

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

  return apiGet("/orders", filters);
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
