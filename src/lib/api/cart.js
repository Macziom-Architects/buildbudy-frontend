import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPut, apiDelete } from "./client";

const LS_KEY = "buildbudy_cart";

function readCart() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}

function writeCart(items) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
}

// ─── Cart API ──────────────────────────────────────────────────────────────────

/**
 * Fetch current cart contents.
 * Returns CartItem[].
 */
export async function getCart() {
  if (USE_MOCK) {
    await delay(0);
    return readCart();
  }
  return apiGet("/cart");
}

/**
 * Add or increment an item.
 * Returns updated CartItem[].
 */
export async function addToCart({ productId, name, price, image, quantity = 1 }) {
  if (USE_MOCK) {
    await delay(0);
    const items = readCart();
    const idx = items.findIndex((i) => i.id === productId);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ id: productId, name, price, image, quantity });
    }
    writeCart(items);
    window.dispatchEvent(new Event("storage"));
    return items;
  }
  return apiPost("/cart/items", { productId, quantity });
}

/**
 * Update quantity of a cart item.
 * Returns updated CartItem[].
 */
export async function updateCartItem(productId, quantity) {
  if (USE_MOCK) {
    await delay(0);
    const items = readCart().map((i) =>
      i.id === productId ? { ...i, quantity } : i
    );
    writeCart(items);
    window.dispatchEvent(new Event("storage"));
    return items;
  }
  return apiPut(`/cart/items/${productId}`, { quantity });
}

/**
 * Remove an item from the cart.
 * Returns updated CartItem[].
 */
export async function removeFromCart(productId) {
  if (USE_MOCK) {
    await delay(0);
    const items = readCart().filter((i) => i.id !== productId);
    writeCart(items);
    window.dispatchEvent(new Event("storage"));
    return items;
  }
  return apiDelete(`/cart/items/${productId}`);
}

/**
 * Clear the cart entirely.
 */
export async function clearCart() {
  if (USE_MOCK) {
    await delay(0);
    writeCart([]);
    window.dispatchEvent(new Event("storage"));
    return [];
  }
  return apiDelete("/cart");
}

/**
 * Apply a coupon code to the cart.
 * Returns { discount: number, type: "percent"|"flat", label: string } | null.
 */
export async function applyCoupon(code) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const COUPONS = {
      BUILDBUDY10: { discount: 10, type: "percent", label: "10% off" },
      FIRST20:     { discount: 20, type: "percent", label: "20% off" },
      SAVE5:       { discount: 5,  type: "percent", label: "5% off"  },
    };
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) {
      const err = new Error("Invalid coupon code");
      err.status = 404;
      throw err;
    }
    return coupon;
  }
  return apiPost("/cart/coupon", { code });
}
