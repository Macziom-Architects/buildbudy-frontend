import { USE_MOCK, MOCK_DELAY_MS, delay, apiPost, apiGet, apiPut, setToken, getToken } from "./client";

// ─── Mock user ─────────────────────────────────────────────────────────────────

const BASE_USER = {
  id: "usr_001",
  name: "Ravi Kumar",
  email: "ravi.kumar@example.com",
  phone: "+91 98765 43210",
  memberSince: "Jan 2024",
  verified: true,
  avatar: null,
};

function readStoredUser() {
  try {
    const raw = localStorage.getItem("bb_user_profile") ?? localStorage.getItem("bb_signup_pending");
    return raw ? { ...BASE_USER, ...JSON.parse(raw) } : BASE_USER;
  } catch {
    return BASE_USER;
  }
}

// ─── Auth API ──────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password.
 * Returns { token, user }.
 */
export async function login({ email, password }) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    if (!email || !password || password.length < 6) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    const token = `mock_${Date.now()}`;
    localStorage.setItem("bb_logged_in", "1");
    setToken(token);
    window.dispatchEvent(new Event("storage"));
    return { token, user: readStoredUser() };
  }
  const data = await apiPost("/auth/login", { email, password }, { token: null });
  setToken(data.token);
  return data;
}

/**
 * Register a new account.
 * Returns { token, user }.
 */
export async function signup({ name, email, phone, password }) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const token = `mock_${Date.now()}`;
    const user = { ...BASE_USER, name, email, phone };
    localStorage.setItem("bb_logged_in", "1");
    localStorage.setItem("bb_user_profile", JSON.stringify({ name, email, phone }));
    setToken(token);
    window.dispatchEvent(new Event("storage"));
    return { token, user };
  }
  const data = await apiPost("/auth/signup", { name, email, phone, password }, { token: null });
  setToken(data.token);
  return data;
}

/**
 * Send a password-reset email.
 */
export async function requestPasswordReset(email) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { ok: true };
  }
  return apiPost("/auth/password/reset", { email }, { token: null });
}

/**
 * Sign out the current user.
 */
export async function logout() {
  if (USE_MOCK) {
    localStorage.removeItem("bb_logged_in");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    return;
  }
  try {
    await apiPost("/auth/logout", {});
  } finally {
    localStorage.removeItem("bb_logged_in");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
  }
}

/**
 * Fetch the authenticated user's profile.
 * Returns a User object.
 */
export async function getProfile() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return readStoredUser();
  }
  return apiGet("/auth/profile");
}

/**
 * Update the authenticated user's profile.
 * Returns the updated User object.
 */
export async function updateProfile(patch) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const current = readStoredUser();
    const updated = { ...current, ...patch };
    localStorage.setItem("bb_user_profile", JSON.stringify(patch));
    return updated;
  }
  return apiPut("/auth/profile", patch);
}

/**
 * Return true if the user is currently authenticated.
 * Safe to call on server (always returns false).
 */
export function isLoggedIn() {
  try {
    return typeof window !== "undefined" && !!localStorage.getItem("bb_logged_in");
  } catch {
    return false;
  }
}
