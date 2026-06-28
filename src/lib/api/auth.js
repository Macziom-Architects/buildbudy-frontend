import { USE_MOCK, MOCK_DELAY_MS, delay, apiPost, apiGet, apiPut, setToken } from "./client";

// ─── Mock user ─────────────────────────────────────────────────────────────────

const BASE_USER = {
  id: "usr_001",
  name: "Ravi Kumar",
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
 * Request an OTP for the given Indian mobile number.
 * Returns { ok: true }.
 */
export async function requestOtp(phone) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      const err = new Error("Invalid mobile number");
      err.status = 400;
      throw err;
    }
    localStorage.setItem("bb_pending_phone", phone.replace(/\D/g, ""));
    return { ok: true };
  }
  return apiPost("/auth/otp/request", { phone }, { token: null });
}

/**
 * Verify OTP and sign in (or auto-register) the user.
 * Returns { token, user, isNewUser }.
 */
export async function verifyOtp(phone, otp) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    if (!otp || otp.length < 6) {
      const err = new Error("Invalid OTP");
      err.status = 401;
      throw err;
    }
    const token = `mock_${Date.now()}`;
    const existingProfile = localStorage.getItem("bb_user_profile");
    const isNewUser = !existingProfile;
    const user = existingProfile
      ? { ...BASE_USER, ...JSON.parse(existingProfile) }
      : { ...BASE_USER, phone: `+91 ${phone}` };
    localStorage.setItem("bb_logged_in", "1");
    setToken(token);
    window.dispatchEvent(new Event("storage"));
    return { token, user, isNewUser };
  }
  const data = await apiPost("/auth/otp/verify", { phone, otp }, { token: null });
  setToken(data.token);
  return data;
}

/**
 * Complete onboarding for a new user.
 * Returns the updated User object.
 */
export async function completeOnboarding({ name, phone, preferences }) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const user = {
      ...BASE_USER,
      name,
      phone,
      memberSince: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    };
    localStorage.setItem("bb_user_profile", JSON.stringify({ name, phone, memberSince: user.memberSince }));
    localStorage.setItem("bb_onboarding", JSON.stringify(preferences ?? {}));
    return user;
  }
  return apiPost("/auth/onboarding", { name, phone, preferences });
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
    localStorage.setItem("bb_user_profile", JSON.stringify({ name: updated.name, phone: updated.phone, memberSince: updated.memberSince }));
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
