"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

// ─── Module-level subscriber set ───────────────────────────────────────────────

const listeners = new Set();

function notifyAll() {
  listeners.forEach((fn) => fn());
}

function subscribe(cb) {
  listeners.add(cb);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", cb);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", cb);
    }
  };
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Reactive localStorage hook — compatible with SSR and useSyncExternalStore.
 *
 * Usage:
 *   const [cart, setCart, removeCart] = useLocalStorage("buildbudy_cart", []);
 *
 * Changes made anywhere (even in other windows) are reflected immediately
 * because we dispatch a storage event after every write.
 *
 * @template T
 * @param {string}  key           — localStorage key
 * @param {T}       defaultValue  — returned when key is absent or parse fails
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]}
 */
export function useLocalStorage(key, defaultValue) {
  function read() {
    if (typeof window === "undefined") return JSON.stringify(defaultValue);
    return localStorage.getItem(key) ?? JSON.stringify(defaultValue);
  }

  const raw = useSyncExternalStore(subscribe, read, () => JSON.stringify(defaultValue));

  const value = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  })();

  const setValue = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(value) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new Event("storage"));
        notifyAll();
      } catch {}
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(new Event("storage"));
      notifyAll();
    } catch {}
  }, [key]);

  return [value, setValue, removeValue];
}
