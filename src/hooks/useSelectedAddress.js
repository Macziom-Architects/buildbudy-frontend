"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { getAddresses } from "@/lib/api/addresses";

const KEY = "bb_selected_address";

function getSnapshot() {
  if (typeof window === "undefined") return "null";
  return localStorage.getItem(KEY) || "null";
}

function getServerSnapshot() {
  return "null";
}

function subscribe(cb) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function parse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function writeSelection(addr) {
  if (addr) localStorage.setItem(KEY, JSON.stringify(addr));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("storage"));
}

/**
 * The single source of truth for "which saved address is the current
 * delivery location" — shared by the navbar's location popover, checkout,
 * and anywhere else that needs to show delivery estimates for the customer's
 * chosen address.
 */
export function useSelectedAddress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const selectedAddress = parse(raw);
  const fetchedDefaultRef = useRef(false);

  // The first time there's no explicit selection yet, quietly adopt the
  // account's default (or first) saved address so the UI never shows an
  // empty state when the user actually has addresses on file.
  useEffect(() => {
    if (selectedAddress || fetchedDefaultRef.current) return;
    fetchedDefaultRef.current = true;
    getAddresses()
      .then((list) => {
        if (!list?.length) return;
        const def = list.find((a) => a.isDefault) ?? list[0];
        writeSelection(def);
      })
      .catch(() => {});
  }, [selectedAddress]);

  const selectAddress = useCallback((addr) => {
    writeSelection(addr);
  }, []);

  const clearSelection = useCallback(() => {
    writeSelection(null);
  }, []);

  return { selectedAddress, selectAddress, clearSelection };
}
