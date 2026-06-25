"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "bb_wishlist";

function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) || "[]";
}

function getServerSnapshot() {
  return "[]";
}

function subscribe(cb) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function parse(raw) {
  try { return JSON.parse(raw); } catch { return []; }
}

export function useWishlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const wishlist = useMemo(() => parse(raw), [raw]);

  const isWishlisted = useCallback(
    (id) => wishlist.some((p) => p.id === id),
    [wishlist],
  );

  const toggleWishlist = useCallback((product) => {
    const current = parse(localStorage.getItem(KEY) || "[]");
    const exists = current.some((p) => p.id === product.id);
    const next = exists
      ? current.filter((p) => p.id !== product.id)
      : [...current, product];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const removeFromWishlist = useCallback((id) => {
    const current = parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(KEY, JSON.stringify(current.filter((p) => p.id !== id)));
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { wishlist, isWishlisted, toggleWishlist, removeFromWishlist };
}
