import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPut } from "./client";
import { MOCK_ORDERS } from "@/lib/ordersData";

// ─── API → UI shape mappers ──────────────────────────────────────────────────────
// Backend `GET /orders` returns { items, page, limit, total } with money in paise and
// a lowercase status enum; map it onto the title-case status + rupee fields the UI uses.

// `pending` means the order was created but Razorpay payment never completed
// (abandoned checkout) — it must NOT render as a successfully placed order.
const ORDER_STATUS_MAP = {
  pending: "Payment Pending",
  confirmed: "Placed",
  partially_delivered: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function fmtDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
}

// List item: GET /orders returns no line items (only a count), so `items` is empty and
// `summary` carries the count for display.
function mapApiOrder(raw) {
  const itemCount = raw.itemCount ?? 0;
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: ORDER_STATUS_MAP[raw.status] ?? "Placed",
    total: (raw.totalPaise ?? 0) / 100,
    itemCount,
    items: [],
    summary: `${itemCount} item${itemCount !== 1 ? "s" : ""}`,
    deliveryDate: null,
    cancelReason: null,
    placedAt: raw.placedAt,
    date: fmtDate(raw.placedAt),
  };
}

// Detail: GET /orders/{id} → flatten subOrders[].items, paise→₹. The address is
// location-only (no recipient name/phone — the buyer is the account holder).
function mapApiOrderDetail(raw) {
  if (!raw) return null;
  const items = (raw.subOrders ?? []).flatMap((so) =>
    (so.items ?? []).map((it) => ({
      name: it.productNameSnapshot,
      sku: it.hsnCode,
      qty: it.quantity,
      price: (it.unitPricePaise ?? 0) / 100,
      image: it.primaryImage ?? null,
      slug: it.productSlug ?? null,
    }))
  );
  const a = raw.address ?? {};
  const paid = ["confirmed", "partially_delivered", "delivered"].includes(raw.status);
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: ORDER_STATUS_MAP[raw.status] ?? "Placed",
    date: fmtDate(raw.placedAt),
    subtotal: (raw.subtotalPaise ?? 0) / 100,
    gst: (raw.gstAmountPaise ?? 0) / 100,
    delivery: 0,
    discount: (raw.discountPaise ?? 0) / 100,
    coupon: null,
    total: (raw.totalPaise ?? 0) / 100,
    payment: { method: paid ? "Online" : "Payment", label: paid ? "Razorpay" : "Pending" },
    address: {
      name: null,
      line1: a.line1 ?? "",
      line2: a.line2 ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      pincode: a.pincode ?? "",
      phone: null,
    },
    items,
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
  let orders = (res?.items ?? []).map(mapApiOrder);

  // The backend doesn't filter by status/search, so apply it client-side (mirrors mock).
  if (filters.status && filters.status !== "all") {
    const active = ["Placed", "Packed", "Shipped", "Out for Delivery"];
    orders = orders.filter((o) =>
      filters.status === "active"    ? active.includes(o.status) :
      filters.status === "delivered" ? o.status === "Delivered"  :
      filters.status === "cancelled" ? o.status === "Cancelled"  : true
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    orders = orders.filter((o) => (o.orderNumber ?? "").toLowerCase().includes(q));
  }
  return { orders, total: orders.length };
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
  return mapApiOrderDetail(await apiGet(`/orders/${encodeURIComponent(id)}`));
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
