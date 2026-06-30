import { USE_MOCK, MOCK_DELAY_MS, delay, apiGet, apiPost, apiPut, apiDelete } from "./client";

// ─── Mock seed ─────────────────────────────────────────────────────────────────

const SEED = [
  {
    id: "addr_1",
    label: "Home",
    name: "Ravi Kumar",
    line1: "204, Sunflower Apartments",
    line2: "Andheri West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Office",
    name: "Ravi Kumar",
    line1: "Block C, Tech Park",
    line2: "Powai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400076",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

const LS_KEY = "bb_addresses";

function loadMock() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Normalise legacy numeric IDs to strings
      return parsed.map((a) => ({ ...a, id: String(a.id) }));
    }
  } catch {}
  return SEED;
}

function saveMock(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

// ─── Addresses API ─────────────────────────────────────────────────────────────

/**
 * Fetch all saved addresses for the authenticated user.
 * Returns Address[].
 */
export async function getAddresses() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return loadMock();
  }
  return apiGet("/addresses");
}

/**
 * Create a new saved address.
 * Returns the created Address.
 */
export async function createAddress(data) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let list = loadMock();
    const newAddr = { ...data, id: `addr_${Date.now()}` };
    if (newAddr.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }
    list = [...list, newAddr];
    if (!list.some((a) => a.isDefault) && list.length > 0) {
      list[0] = { ...list[0], isDefault: true };
    }
    saveMock(list);
    return newAddr;
  }
  return apiPost("/addresses", data);
}

/**
 * Update an existing saved address.
 * Returns the updated Address.
 */
export async function updateAddress(id, data) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let list = loadMock();
    if (data.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }
    list = list.map((a) =>
      a.id === String(id) ? { ...a, ...data, id: String(id) } : a
    );
    if (!list.some((a) => a.isDefault) && list.length > 0) {
      list[0] = { ...list[0], isDefault: true };
    }
    saveMock(list);
    return list.find((a) => a.id === String(id));
  }
  return apiPut(`/addresses/${encodeURIComponent(id)}`, data);
}

/**
 * Delete a saved address.
 * Returns { ok: true }.
 */
export async function deleteAddress(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    let list = loadMock().filter((a) => a.id !== String(id));
    if (!list.some((a) => a.isDefault) && list.length > 0) {
      list[0] = { ...list[0], isDefault: true };
    }
    saveMock(list);
    return { ok: true };
  }
  return apiDelete(`/addresses/${encodeURIComponent(id)}`);
}

/**
 * Set an address as the default delivery address.
 * Returns { ok: true }.
 */
export async function setDefaultAddress(id) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const list = loadMock().map((a) => ({ ...a, isDefault: a.id === String(id) }));
    saveMock(list);
    return { ok: true };
  }
  return apiPut(`/addresses/${encodeURIComponent(id)}/default`, {});
}
