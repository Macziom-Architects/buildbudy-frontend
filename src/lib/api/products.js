import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, ApiError } from "./client";
import data from "@/lib/data/products.json";

// ─── Synchronous helpers ──────────────────────────────────────────────────────

export function getProducts() {
  return data["GET /products"];
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) ?? null;
}

export function getProductBySlug(slug) {
  return getProducts().find((p) => p.slug === slug) ?? null;
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

/** Maps an OpenSearch hit (GET /search item) to the card/grid product shape. */
function mapSearchHit(hit) {
  const src = hit?._source ?? {};
  return {
    id: src.product_id,
    slug: src.slug,
    name: src.name ?? "",
    description: src.description ?? "",
    price: paiseToRupees(src.price_paise),
    originalPrice: null,
    image: src.primary_image ?? null,
    images: src.primary_image ? [src.primary_image] : [],
    rating: null,
    reviewsCount: 0,
    badge: null,
    brand: null,
    category: src.category_name ?? "",
    routeCategory: src.category_slug ?? "",
    inStock: (src.stock_available ?? 0) > 0,
    supplierProductId: hit?._id ?? null, // the index is keyed by listing id — add-to-cart ready
    supplierCount: 1,
    unitOfMeasure: src.unit_of_measure ?? null,
    hsnCode: src.hsn_code ?? null,
    attributes: src.attributes ?? null,
  };
}

/**
 * Full-catalog search via the backend's OpenSearch endpoint (GET /search).
 * Unlike fetchProducts (one page of the listing), this ranks across the whole
 * catalog with fuzzy matching.
 */
export async function searchCatalog(query, { page = 1, limit = 40 } = {}) {
  const q = (query ?? "").trim();
  if (!q) return { products: [], total: 0 };
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const products = searchProducts(q);
    return { products, total: products.length };
  }
  const res = await apiGet("/search", { q, city: "delhi-ncr", page, limit });
  const products = (res?.items ?? []).map(mapSearchHit);
  return { products, total: res?.total ?? products.length };
}

// ─── API → UI shape mappers ─────────────────────────────────────────────────────
// The backend speaks paise and DB column names; the UI components expect rupees and
// the field names established by the mock catalog. These adapters bridge the two so
// the rest of the app stays unchanged.

function paiseToRupees(paise) {
  return paise != null ? Number(paise) / 100 : 0;
}

/** Maps a `GET /products` list item to the card/grid product shape. */
function mapApiListProduct(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    price: paiseToRupees(raw.minPricePaise),
    originalPrice: null,
    image: raw.primaryImage ?? null,
    images: raw.primaryImage ? [raw.primaryImage] : [],
    rating: null,                       // backend has no ratings yet
    reviewsCount: 0,
    badge: null,
    brand: null,
    category: raw.categoryName ?? "",
    routeCategory: raw.categorySlug ?? "",
    inStock: raw.minPricePaise != null, // min-price subquery only counts in-stock supply
    supplierProductId: raw.defaultSupplierProductId ?? null, // cheapest in-stock listing — for add-to-cart
    supplierCount: Number(raw.supplierCount ?? 0),
    unitOfMeasure: raw.unitOfMeasure ?? null,
    hsnCode: raw.hsnCode ?? null,
    attributes: raw.attributes ?? null,
  };
}

/** Maps `GET /products/{slug}` plus its listings to the detail-page product shape. */
function mapApiDetailProduct(raw, listings = []) {
  const cheapest = listings[0]; // backend returns listings sorted by price ascending
  const images = Array.isArray(raw.images) ? raw.images.map((img) => img.url) : [];
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    price: paiseToRupees(cheapest?.effectivePricePaise ?? cheapest?.pricePaise),
    originalPrice: null,
    image: images[0] ?? null,
    images,
    rating: null,
    reviewsCount: 0,
    badge: null,
    brand: null,
    category: raw.categoryName ?? "",
    routeCategory: raw.categorySlug ?? "",
    inStock: listings.length > 0,
    supplierProductId: cheapest?.id ?? null, // cheapest listing — for add-to-cart
    unitOfMeasure: raw.unitOfMeasure ?? null,
    hsnCode: raw.hsnCode ?? null,
    attributes: raw.attributes ?? null,
    gst: raw.gst ?? null,
    listings,
  };
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

  // Live: the backend paginates server-side and exposes only category/city filters,
  // so we pull a generous page and let the page apply search/sort/filters client-side.
  const res = await apiGet("/products", { city: "delhi-ncr", limit: 100, ...filters });
  const products = (res?.products ?? []).map(mapApiListProduct);
  return { products, total: products.length };
}

/**
 * Homepage "Featured Products": curated picks (products.is_featured, set by
 * migration/merchandising) from the live catalog. Falls back to the mock
 * selection if the API is unreachable or nothing is flagged yet.
 */
export async function fetchFeaturedProducts(limit = 8) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return getDiverseFeaturedProducts(limit, 2);
  }
  try {
    const res = await apiGet("/products", { city: "delhi-ncr", featured: "true", limit });
    const products = (res?.products ?? [])
      .map(mapApiListProduct)
      .filter((p) => p.inStock && p.image);
    return products.length ? products : getDiverseFeaturedProducts(limit, 2);
  } catch {
    return getDiverseFeaturedProducts(limit, 2);
  }
}

/**
 * Homepage "Featured Essentials": recent in-stock catalog picks that aren't
 * already in the Featured section (no view/sales data yet to rank by).
 */
export async function fetchEssentialProducts(n = 5) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return getTopProducts(n);
  }
  try {
    const [{ products }, featured] = await Promise.all([
      fetchProducts({ limit: 40 }),
      fetchFeaturedProducts(),
    ]);
    const featuredIds = new Set(featured.map((p) => p.id));
    const picks = products
      .filter((p) => p.inStock && p.image && !featuredIds.has(p.id))
      .slice(0, n);
    return picks.length ? picks : getTopProducts(n);
  } catch {
    return getTopProducts(n);
  }
}

export async function fetchProductBySlug(slug) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return getProductBySlug(slug) ?? getProductById(slug);
  }

  try {
    const [product, listings] = await Promise.all([
      apiGet(`/products/${encodeURIComponent(slug)}`),
      apiGet(`/products/${encodeURIComponent(slug)}/listings`).catch(() => []),
    ]);
    return mapApiDetailProduct(product, listings ?? []);
  } catch (err) {
    // During the incremental migration the live catalog holds only a subset of
    // products; fall back to the mock entry so links from not-yet-wired sections
    // (homepage, DIY, search) keep resolving instead of 404ing.
    if (err instanceof ApiError && err.status === 404) {
      return getProductBySlug(slug) ?? getProductById(slug) ?? null;
    }
    throw err;
  }
}

export async function fetchRelatedProducts(productId, { routeCategory, limit = 4 } = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const all = getProducts();
    const sameRoute = all.filter(
      (p) => p.id !== productId && routeCategory && p.routeCategory === routeCategory
    );
    const fallback = all.filter(
      (p) => p.id !== productId && (!routeCategory || p.routeCategory !== routeCategory)
    );
    return [...sameRoute, ...fallback].slice(0, limit);
  }

  // No backend `/related` endpoint; derive from the live catalog instead.
  const { products } = await fetchProducts();
  const pool = products.filter((p) => p.id !== productId && p.slug !== productId);
  const sameRoute = routeCategory ? pool.filter((p) => p.routeCategory === routeCategory) : [];
  const rest = pool.filter((p) => !sameRoute.includes(p));
  return [...sameRoute, ...rest].slice(0, limit);
}
