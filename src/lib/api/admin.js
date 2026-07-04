import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

// ─── Admin API (requires a JWT whose user has the `admin` role) ────────────────
//
// No mock mode here — the admin panel only makes sense against the real
// backend, and the /admin routes 403 for non-admin users anyway.

/** List ALL products (inactive + unapproved included). */
export function adminListProducts({ q, categoryId, page = 1, limit = 20 } = {}) {
  return apiGet("/products/admin", { q: q || undefined, categoryId: categoryId || undefined, page, limit });
}

/**
 * Create a product (auto-approved).
 * body: { name, categoryId, hsnCode, unitOfMeasure, description?, imageUrls?, pricePaise? }
 */
export function adminCreateProduct(body) {
  return apiPost("/products/admin", body);
}

/** Patch product fields — any of name/description/categoryId/hsnCode/unitOfMeasure/isActive/imageUrls/pricePaise. */
export function adminUpdateProduct(id, patch) {
  return apiPatch(`/products/admin/${id}`, patch);
}

/** Delete a product. Returns { outcome: "deleted" | "deactivated" } — deactivated when order history references it. */
export function adminDeleteProduct(id) {
  return apiDelete(`/products/admin/${id}`);
}

/** Rename a category — the slug follows the name (e.g. "Materials" → materials). */
export function adminRenameCategory(id, name) {
  return apiPatch(`/products/admin/categories/${id}`, { name });
}

/** Rebuild the OpenSearch index so storefront search reflects admin edits. Fire-and-forget. */
export function reindexSearch() {
  return apiPost("/search/reindex", {}).catch(() => {});
}
