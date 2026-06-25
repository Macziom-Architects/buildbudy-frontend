"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getProfile, updateProfile as apiUpdateProfile } from "@/lib/api/auth";

// ─── Reactive logged-in state ──────────────────────────────────────────────────

function subscribeAuthState(cb) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getLoggedIn() {
  try {
    return typeof window !== "undefined" && !!localStorage.getItem("bb_logged_in");
  } catch {
    return false;
  }
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Auth state hook — reactive to localStorage changes across tabs.
 *
 * Returns:
 *   isLoggedIn  — boolean (reactive)
 *   user        — User object | null
 *   loading     — true while profile is being fetched
 *   login()     — async, throws on invalid credentials
 *   signup()    — async
 *   logout()    — async
 *   updateProfile() — async, updates user state
 */
export function useAuth() {
  const isLoggedIn = useSyncExternalStore(
    subscribeAuthState,
    getLoggedIn,
    () => false
  );

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    setLoading(true);
    getProfile()
      .then((u) => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiLogin(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiSignup(data);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const updated = await apiUpdateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  return { isLoggedIn, user, loading, error, login, signup, logout, updateProfile };
}
