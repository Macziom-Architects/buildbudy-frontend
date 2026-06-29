/**
 * BuildBudy API Client
 *
 * Set NEXT_PUBLIC_API_URL in .env.local to point at a real backend.
 * When unset, every domain module falls through to its mock implementation,
 * so the UI can be developed entirely offline and switched to a live API
 * by setting a single environment variable.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TIMEOUT_MS = 12_000;

/** True → use in-module mock data; false → call the real API */
export const USE_MOCK = !BASE_URL;

/**
 * Simulated network latency for mock responses.
 * Kept short in production builds so SSR/prerender stays fast.
 */
export const MOCK_DELAY_MS =
  typeof window !== "undefined" && process.env.NODE_ENV !== "production"
    ? 600
    : 0;

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Error type ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  /** @param {number} status  @param {string} message  @param {unknown} [body] */
  constructor(status, message, body = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ─── Token helper ──────────────────────────────────────────────────────────────

export function getToken() {
  try {
    return typeof window !== "undefined"
      ? localStorage.getItem("bb_auth_token")
      : null;
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem("bb_auth_token", token);
    else localStorage.removeItem("bb_auth_token");
  } catch {}
}

// ─── Core request ──────────────────────────────────────────────────────────────

/**
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} method
 * @param {string} path  — e.g. "/products"
 * @param {{ body?: unknown, params?: Record<string,string|number>, token?: string|null }} [opts]
 */
async function request(method, path, { body, params, token } = {}) {
  const url = new URL(`${BASE_URL}/api/v1${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });
  }

  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const resolvedToken = token !== undefined ? token : getToken();

  try {
    const res = await fetch(url.toString(), {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    clearTimeout(tid);

    if (!res.ok) {
      let errorBody = null;
      try { errorBody = await res.json(); } catch {}
      throw new ApiError(
        res.status,
        errorBody?.message ?? res.statusText,
        errorBody
      );
    }

    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    clearTimeout(tid);
    if (err instanceof ApiError) throw err;
    if (err.name === "AbortError") throw new ApiError(408, "Request timed out");
    throw new ApiError(0, err.message ?? "Network error");
  }
}

// ─── Public helpers ────────────────────────────────────────────────────────────

/** GET /api{path}?{params} */
export const apiGet = (path, params, opts) =>
  request("GET", path, { params, ...opts });

/** POST /api{path} with JSON body */
export const apiPost = (path, body, opts) =>
  request("POST", path, { body, ...opts });

/** PUT /api{path} with JSON body */
export const apiPut = (path, body, opts) =>
  request("PUT", path, { body, ...opts });

/** PATCH /api{path} with JSON body */
export const apiPatch = (path, body, opts) =>
  request("PATCH", path, { body, ...opts });

/** DELETE /api{path} */
export const apiDelete = (path, opts) =>
  request("DELETE", path, opts);
