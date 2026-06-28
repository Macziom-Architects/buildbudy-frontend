"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  requestOtp as apiRequestOtp,
  verifyOtp as apiVerifyOtp,
  logout as apiLogout,
  getProfile,
  updateProfile as apiUpdateProfile,
  completeOnboarding as apiCompleteOnboarding,
} from "@/lib/api/auth";

// ─── Reactive auth state ───────────────────────────────────────────────────────

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
 * Mobile-first auth hook — reactive to localStorage changes across tabs.
 *
 * Returns:
 *   isLoggedIn       — boolean (reactive)
 *   user             — User object | null
 *   loading          — true while profile is being fetched
 *   error            — last error | null
 *   requestOtp()     — async, sends OTP to given phone number
 *   verifyOtp()      — async, verifies OTP and logs in
 *   completeOnboarding() — async, saves name + preferences for new users
 *   logout()         — async
 *   updateProfile()  — async, updates user state
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

  const requestOtp = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequestOtp(phone);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiVerifyOtp(phone, otp);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeOnboarding = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCompleteOnboarding(data);
      setUser(result);
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

  return {
    isLoggedIn,
    user,
    loading,
    error,
    requestOtp,
    verifyOtp,
    completeOnboarding,
    logout,
    updateProfile,
  };
}
