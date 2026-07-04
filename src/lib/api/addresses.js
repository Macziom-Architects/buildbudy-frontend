import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPatch, apiDelete } from "./client";

// ─── Addresses API ───────────────────────────────────────────────────────────────
//
// The backend stores a **location only**: { label, line1, line2, pincode } — it
// derives city/district/state/state_code from the pincode (a serviceable-pincode
// lookup) and ignores any recipient name/phone (those come from the user's profile
// and account). Source of truth is Postgres via /users/me/addresses; the UI keeps
// the list in React state for the session and re-fetches after every mutation.

/** Backend address row → the shape the profile UI renders. */
function mapApiAddress(raw) {
  return {
    id: raw.id,
    label: raw.label ?? "Home",
    line1: raw.line1 ?? "",
    line2: raw.line2 ?? "",
    city: raw.city ?? "",
    district: raw.district ?? "",
    state: raw.state ?? "",
    pincode: raw.pincode ?? "",
    isDefault: !!raw.isDefault,
  };
}

/** Form → only the fields the backend actually persists. */
function toApiBody(form) {
  return {
    label: form.label || undefined,
    line1: form.line1,
    line2: form.line2 || undefined,
    pincode: form.pincode,
    isDefault: !!form.isDefault,
  };
}

export async function listAddresses() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return [];
  }
  const res = await apiGet("/users/me/addresses");
  return (res ?? []).map(mapApiAddress);
}

export async function createAddress(form) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return mapApiAddress({ ...form, id: `mock-${Date.now()}` });
  }
  return mapApiAddress(await apiPost("/users/me/addresses", toApiBody(form)));
}

export async function updateAddress(id, form) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return mapApiAddress({ ...form, id });
  }
  return mapApiAddress(await apiPatch(`/users/me/addresses/${id}`, toApiBody(form)));
}

export async function deleteAddress(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return;
  }
  await apiDelete(`/users/me/addresses/${id}`);
}

export async function setDefaultAddress(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return;
  }
  return mapApiAddress(await apiPatch(`/users/me/addresses/${id}/default`));
}
