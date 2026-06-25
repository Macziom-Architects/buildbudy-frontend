import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost } from "./client";
import { SERVICES, SPECIALISTS, getServiceBySlug, getSpecialists } from "@/lib/servicesData";

// ─── Services API ──────────────────────────────────────────────────────────────

/**
 * Fetch all available service categories.
 * Returns Service[].
 */
export async function fetchServices() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return SERVICES;
  }
  return apiGet("/services");
}

/**
 * Fetch a single service by slug (e.g. "plumbing").
 * Returns Service | null.
 */
export async function fetchServiceBySlug(slug) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return getServiceBySlug(slug) ?? null;
  }
  return apiGet(`/services/${encodeURIComponent(slug)}`);
}

/**
 * Fetch specialists for a service.
 * Filters: { search?, availableOnly?, sort? }
 * Returns Specialist[].
 */
export async function fetchSpecialists(slug, filters = {}) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let list = getSpecialists(slug) ?? [];
    if (filters.availableOnly) list = list.filter((s) => s.available);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialization.toLowerCase().includes(q)
      );
    }
    return list;
  }
  return apiGet(`/services/${encodeURIComponent(slug)}/specialists`, filters);
}

/**
 * Create a service booking.
 * Body: { serviceId, specialistId?, date, timeSlot, address, name, phone, description }
 * Returns { ref: string, booking: Booking }.
 */
export async function createBooking(body) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const ref = "BB-" + Math.floor(100000 + Math.random() * 900000);
    const booking = { ...body, ref, createdAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem("bb_bookings") || "[]");
      localStorage.setItem("bb_bookings", JSON.stringify([booking, ...existing]));
    } catch {}
    return { ref, booking };
  }
  return apiPost("/bookings", body);
}

/**
 * Fetch all bookings for the current user.
 * Returns Booking[].
 */
export async function getBookings() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    try {
      return JSON.parse(localStorage.getItem("bb_bookings") || "[]");
    } catch {
      return [];
    }
  }
  return apiGet("/bookings");
}
