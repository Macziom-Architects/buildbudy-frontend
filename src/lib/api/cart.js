import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Cart API — backed by the server (Redis cart, keyed per user).
 *
 * The cart is keyed by `supplierProductId` (a specific supplier's listing of a
 * product), NOT a bare product id. Every mutating call returns the full,
 * updated cart as `CartItem[]`:
 *
 *   CartItem = {
 *     supplierProductId, quantity, productId, productName, productSlug,
 *     unitOfMeasure, supplierId, supplierName, pricePaise, availableStock,
 *     minOrderQuantity, hsnCode, primaryImageUrl
 *   }
 *
 * Note: `pricePaise` is money in paise — divide by 100 for rupees.
 */

/** GET /cart → CartItem[] */
export async function getCart() {
  return apiGet("/cart");
}

/** POST /cart { supplierProductId, quantity } → CartItem[] */
export async function addToCart(supplierProductId, quantity = 1) {
  return apiPost("/cart", { supplierProductId, quantity });
}

/** PATCH /cart/{supplierProductId} { quantity } → CartItem[] */
export async function updateCartItem(supplierProductId, quantity) {
  return apiPatch(`/cart/${supplierProductId}`, { quantity });
}

/** DELETE /cart/{supplierProductId} → CartItem[] */
export async function removeFromCart(supplierProductId) {
  return apiDelete(`/cart/${supplierProductId}`);
}

/** DELETE /cart → null (204) */
export async function clearCart() {
  return apiDelete("/cart");
}

/**
 * POST /cart/checkout → creates the order + a Razorpay order, returns
 * { orderId, orderNumber, totalPaise, razorpayOrderId, razorpayKeyId }.
 * The backend clears the cart as part of this call.
 */
export async function checkoutCart(addressId, buyerGstin) {
  return apiPost("/cart/checkout", { addressId, buyerGstin });
}
