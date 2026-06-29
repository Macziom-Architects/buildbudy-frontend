"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  requestOtp as apiRequestOtp,
  verifyOtp as apiVerifyOtp,
  logout as apiLogout,
  getProfile,
  updateProfile as apiUpdateProfile,
} from "@/lib/api/auth";

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
 *   requestOtp(phoneNumber)      — async, asks backend to send an OTP
 *   verifyOtp(phoneNumber, otp)  — async, starts a session; returns { accessToken, user }
 *   logout()    — clears the session client-side
 *   updateProfile() — async, updates user state (onboarding name + email)
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
    if (!isLoggedIn) return; // logged-out user is derived as null in the return value
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the profile fetch kicked off below
    setLoading(true);
    getProfile()
      .then((u) => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  const requestOtp = useCallback(async (phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequestOtp(phoneNumber);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phoneNumber, otp) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiVerifyOtp(phoneNumber, otp);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const updated = await apiUpdateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  return { isLoggedIn, user: isLoggedIn ? user : null, loading, error, requestOtp, verifyOtp, logout, updateProfile };
}
