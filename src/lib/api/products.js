import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet } from "./client";
import data from "@/lib/data/products.json";

// ─── Synchronous helpers ──────────────────────────────────────────────────────

export function getProducts() {
  return data["GET /products"];
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) ?? null;
}

export function getProductsByCategory(category) {
  return getProducts().filter(
    (p) => p.category?.toLowerCase() === category?.toLowerCase()
  );
}

export function getProductsByRouteCategory(routeCategory) {
  return getProducts().filter(
    (p) => p.routeCategory?.toLowerCase() === routeCategory?.toLowerCase()
  );
}

/** Returns top n products by views, optionally filtered by routeCategory */
export function getTopProducts(n = 8, routeCategory = null) {
  let prods = getProducts().filter((p) => p.inStock && p.image);
  if (routeCategory) {
    prods = prods.filter((p) => p.routeCategory === routeCategory);
  }
  return prods.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, n);
}

/**
 * Returns up to `perCategory` products per each routeCategory, sorted by views.
 * Useful for diverse featured sections.
 */
export function getDiverseFeaturedProducts(total = 8, perCategory = 2) {
  const all = getProducts().filter((p) => p.inStock && p.image);
  const categoryOrder = ["materials", "tools", "hardware", "plumbing", "electrical", "paint"];
  const picked = [];
  const used = new Set();

  for (const cat of categoryOrder) {
    if (picked.length >= total) break;
    const catProducts = all
      .filter((p) => p.routeCategory === cat && !used.has(p.id))
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, perCategory);
    for (const p of catProducts) {
      if (picked.length >= total) break;
      picked.push(p);
      used.add(p.id);
    }
  }

  // Fill remainder from any category
  if (picked.length < total) {
    const rest = all
      .filter((p) => !used.has(p.id))
      .sort((a, b) => (b.views || 0) - (a.views || 0));
    for (const p of rest) {
      if (picked.length >= total) break;
      picked.push(p);
    }
  }

  return picked;
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return getProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

// ─── Async API ─────────────────────────────────────────────────────────────────

export async function fetchProducts(filters = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let products = getProducts();

    if (filters.category) {
      products = products.filter(
        (p) =>
          p.category?.toLowerCase() === filters.category.toLowerCase() ||
          p.routeCategory?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.priceRange === "low")  products = products.filter((p) => p.price < 500);
    if (filters.priceRange === "mid")  products = products.filter((p) => p.price >= 500 && p.price <= 2000);
    if (filters.priceRange === "high") products = products.filter((p) => p.price > 2000);
    if (filters.ratings)               products = products.filter((p) => p.rating >= Number(filters.ratings));
    if (filters.availability === "inStock") products = products.filter((p) => p.inStock);

    return { products, total: products.length };
  }
  return apiGet("/products", filters);
}

export async function fetchProductById(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return getProductById(id);
  }
  return apiGet(`/products/${encodeURIComponent(id)}`);
}

export async function fetchRelatedProducts(productId, { category, routeCategory, limit = 4 } = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const all = getProducts();
    // Prefer same routeCategory, then same category, then anything
    const sameRoute = all.filter(
      (p) => p.id !== productId && routeCategory && p.routeCategory === routeCategory
    );
    const fallback = all.filter(
      (p) => p.id !== productId && (!routeCategory || p.routeCategory !== routeCategory)
    );
    return [...sameRoute, ...fallback].slice(0, limit);
  }
  return apiGet(`/products/${encodeURIComponent(productId)}/related`, { limit });
}
