import { USE_MOCK, MOCK_DELAY_MS, delay, apiPost, apiGet, apiPatch, setToken } from "./client";

// ─── Mock user ─────────────────────────────────────────────────────────────────

const BASE_USER = {
  id: "usr_001",
  fullName: "Ravi Kumar",
  email: "ravi.kumar@example.com",
  phoneNumber: "+91 98765 43210",
  roles: ["customer"],
  isVerified: true,
};

function readStoredUser() {
  try {
    const raw = localStorage.getItem("bb_user_profile");
    return raw ? { ...BASE_USER, ...JSON.parse(raw) } : BASE_USER;
  } catch {
    return BASE_USER;
  }
}

function markLoggedIn() {
  try {
    localStorage.setItem("bb_logged_in", "true");
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

// ─── Auth API (phone + OTP) ──────────────────────────────────────────────────────

/**
 * Request an OTP for a phone number.
 * Backend: POST /auth/otp/request { phoneNumber }
 * Returns { message, expiresInSeconds, otp? } — `otp` is only present for the
 * configured test number / in development.
 */
export async function requestOtp(phoneNumber) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return { message: "OTP sent", expiresInSeconds: 600, otp: "123456" };
  }
  return apiPost("/auth/otp/request", { phoneNumber }, { token: null });
}

/**
 * Verify an OTP and start a session.
 * Backend: POST /auth/otp/verify { phoneNumber, otp }
 * Returns { accessToken, user } where
 *   user = { id, phoneNumber, fullName, roles[], isNewUser }
 * Stores the JWT and flags the client as logged in.
 */
export async function verifyOtp(phoneNumber, otp) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const token = `mock_${Date.now()}`;
    setToken(token);
    markLoggedIn();
    return {
      accessToken: token,
      user: { ...BASE_USER, phoneNumber, isNewUser: false },
    };
  }
  const data = await apiPost("/auth/otp/verify", { phoneNumber, otp }, { token: null });
  setToken(data.accessToken);
  markLoggedIn();
  return data;
}

/**
 * Sign out the current user. JWT is stateless — there is no server call;
 * just clear the token and local flags.
 */
export function logout() {
  try {
    setToken(null);
    localStorage.removeItem("bb_logged_in");
    localStorage.removeItem("bb_user_profile");
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

/**
 * Fetch the authenticated user's profile.
 * Backend: GET /auth/me
 * Returns { id, phoneNumber, fullName, email, roles[], isVerified, createdAt }.
 */
export async function getProfile() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return readStoredUser();
  }
  return apiGet("/auth/me");
}

/**
 * Update the authenticated user's profile (used by onboarding for name + email).
 * Backend: PATCH /users/me { fullName?, email? }
 * Throws ApiError(400) with "This email is already in use" on email conflict.
 */
export async function updateProfile(patch) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const updated = { ...readStoredUser(), ...patch };
    localStorage.setItem("bb_user_profile", JSON.stringify(updated));
    return updated;
  }
  return apiPatch("/users/me", patch);
}

/**
 * Return true if the user is currently authenticated.
 * Safe to call on the server (always returns false).
 */
export function isLoggedIn() {
  try {
    return typeof window !== "undefined" && !!localStorage.getItem("bb_logged_in");
  } catch {
    return false;
  }
}
