import { USE_MOCK, MOCK_DELAY_MS, delay, apiPost, apiGet, apiPatch, setToken } from "./client";
import { getProductById } from "@/lib/api/products";

// ─── Demo account (mock mode only) ─────────────────────────────────────────────
// A fixed frontend-only account for development/demos. Isolated behind USE_MOCK,
// so it is automatically disabled the moment NEXT_PUBLIC_API_URL points at a
// real backend.
export const DEMO_PHONE = "9999999999";
export const DEMO_OTP = "123456";

const DEMO_PROFILE = {
  name: "Aarav Sharma",
  phone: `+91 ${DEMO_PHONE.slice(0, 5)} ${DEMO_PHONE.slice(5)}`,
  memberSince: "Jan 2024",
  verified: true,
  avatar: null,
  preferences: {
    project: "Renovation",
    needs: ["Tools", "Home Improvement", "Appliances"],
    help: "Yes",
    location: { city: "Mumbai", pincode: "400058", state: "Maharashtra", type: "manual" },
  },
};

const DEMO_WISHLIST_IDS = ["691b1635678f73cb19cc5647", "693c61bd13c1a03e5645a5b9", "698b1fb1a4082487b47f53e0"];
const DEMO_CART_IDS = ["699e8ca71afd61b132d34dfe", "68c541c8097394da98d2b5c8"];
const DEMO_RECENTLY_VIEWED_IDS = [
  "691b1635678f73cb19cc5647", "693c61bd13c1a03e5645a5b9", "698b1fb1a4082487b47f53e0",
  "699e8ca71afd61b132d34dfe", "68c541c8097394da98d2b5c8", "693d2073bf8b5fec95571a3b",
];
const DEMO_BOOKMARKS = ["1", "5", "12"];

const DEMO_BOOKINGS = [
  {
    ref: "BB-482913",
    serviceId: "plumbing",
    serviceName: "Plumbing",
    description: "Kitchen sink tap is leaking and needs a full fixture replacement.",
    address: "204, Sunflower Apartments, Andheri West, Mumbai",
    pincode: "400058",
    date: "2024-04-02",
    timeSlot: "10:00 AM - 12:00 PM",
    name: "Aarav Sharma",
    phone: `+91 ${DEMO_PHONE}`,
    bookedAt: "2024-03-28T09:15:00.000Z",
    status: "confirmed",
  },
  {
    ref: "BB-771540",
    serviceId: "electrical",
    serviceName: "Electrical",
    description: "Annual electrical safety inspection for a 2BHK apartment.",
    address: "204, Sunflower Apartments, Andheri West, Mumbai",
    pincode: "400058",
    date: "2024-03-18",
    timeSlot: "2:00 PM - 4:00 PM",
    name: "Aarav Sharma",
    phone: `+91 ${DEMO_PHONE}`,
    bookedAt: "2024-03-10T11:40:00.000Z",
    status: "completed",
  },
];

/** Seed realistic demo data into localStorage for the fixed demo account. */
function seedDemoAccount() {
  try {
    const wishlist = DEMO_WISHLIST_IDS.map(getProductById).filter(Boolean);
    localStorage.setItem("bb_wishlist", JSON.stringify(wishlist));

    const cart = DEMO_CART_IDS.map(getProductById)
      .filter(Boolean)
      .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category, quantity: 1 }));
    localStorage.setItem("buildbudy_cart", JSON.stringify(cart));

    localStorage.setItem("bb_recently_viewed", JSON.stringify(DEMO_RECENTLY_VIEWED_IDS));
    localStorage.setItem("bb_bookmarks", JSON.stringify(DEMO_BOOKMARKS));
    localStorage.setItem("bb_bookings", JSON.stringify(DEMO_BOOKINGS));
  } catch {
    // localStorage unavailable (SSR/private mode) — safe to skip seeding
  }
}

// ─── Per-phone profile store (mock mode only) ─────────────────────────────────
// Keyed by phone so "existing user" vs "new user" is correct per mobile number
// even though there's no real backend.

function loadProfiles() {
  try {
    return JSON.parse(localStorage.getItem("bb_profiles") || "{}");
  } catch {
    return {};
  }
}

function saveProfile(phone, profile) {
  try {
    const all = loadProfiles();
    all[phone] = profile;
    localStorage.setItem("bb_profiles", JSON.stringify(all));
  } catch {}
}

function getActivePhone() {
  try {
    return localStorage.getItem("bb_active_phone");
  } catch {
    return null;
  }
}

function readStoredUser() {
  const phone = getActivePhone();
  const profiles = loadProfiles();
  const stored = phone ? profiles[phone] : null;
  if (stored) return stored;
  return { name: "", phone: phone ? `+91 ${phone}` : "", memberSince: "", verified: true, avatar: null };
}

function markLoggedIn() {
  try {
    localStorage.setItem("bb_logged_in", "true");
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

// ─── Auth API (phone + OTP) ──────────────────────────────────────────────────────

/**
 * Request an OTP for the given Indian mobile number.
 * Backend: POST /auth/otp/request { phoneNumber }
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
  return apiPost("/auth/otp/request", { phoneNumber: phone }, { token: null });
}

/**
 * Verify an OTP and start a session (auto-registers new numbers).
 * Backend: POST /auth/otp/verify { phoneNumber, otp }
 * Returns { token, user, isNewUser }. Stores the JWT and flags the client as
 * logged in.
 */
export async function verifyOtp(phone, otp) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const isDemo = cleanPhone === DEMO_PHONE;

    if (isDemo) {
      if (otp !== DEMO_OTP) {
        const err = new Error("Incorrect OTP. The demo account uses 123456.");
        err.status = 401;
        throw err;
      }
    } else if (!otp || otp.length < 6) {
      const err = new Error("Invalid OTP");
      err.status = 401;
      throw err;
    }

    const token = `mock_${Date.now()}`;
    let isNewUser;
    let user;

    if (isDemo) {
      saveProfile(DEMO_PHONE, DEMO_PROFILE);
      seedDemoAccount();
      isNewUser = false;
      user = DEMO_PROFILE;
    } else {
      const profiles = loadProfiles();
      const existing = profiles[cleanPhone];
      isNewUser = !existing;
      user = existing ?? { name: "", phone: `+91 ${cleanPhone}`, memberSince: "", verified: true, avatar: null };
    }

    localStorage.setItem("bb_active_phone", cleanPhone);
    setToken(token);
    markLoggedIn();
    return { token, user, isNewUser };
  }
  const data = await apiPost("/auth/otp/verify", { phoneNumber: phone, otp }, { token: null });
  setToken(data.accessToken ?? data.token);
  markLoggedIn();
  return {
    token: data.accessToken ?? data.token,
    user: data.user,
    isNewUser: data.user?.isNewUser ?? data.isNewUser ?? false,
  };
}

/**
 * Complete onboarding for a new user.
 * Backend: POST /auth/onboarding { name, phone, preferences }
 * Returns the updated User object.
 */
export async function completeOnboarding({ name, phone, preferences }) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const cleanPhone = (phone || getActivePhone() || "").replace(/\D/g, "");
    const user = {
      name,
      phone: cleanPhone ? `+91 ${cleanPhone}` : phone,
      memberSince: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      verified: true,
      avatar: null,
      preferences: preferences ?? {},
    };
    saveProfile(cleanPhone, user);
    return user;
  }
  return apiPost("/auth/onboarding", { name, phone, preferences });
}

/**
 * Sign out the current user. JWT is stateless — there is no required server
 * call; just clear the token and local flags.
 */
export async function logout() {
  if (USE_MOCK) {
    localStorage.removeItem("bb_logged_in");
    localStorage.removeItem("bb_active_phone");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    return;
  }
  try {
    await apiPost("/auth/logout", {});
  } finally {
    setToken(null);
    localStorage.removeItem("bb_logged_in");
    localStorage.removeItem("bb_active_phone");
    window.dispatchEvent(new Event("storage"));
  }
}

/**
 * Fetch the authenticated user's profile.
 * Backend: GET /auth/me
 */
export async function getProfile() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return readStoredUser();
  }
  return apiGet("/auth/me");
}

/**
 * Update the authenticated user's profile (used by onboarding + profile edits).
 * Backend: PATCH /users/me
 */
export async function updateProfile(patch) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const phone = getActivePhone();
    const current = readStoredUser();
    const updated = { ...current, ...patch };
    saveProfile(phone, updated);
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
