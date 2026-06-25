"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch(
 *     () => getOrders({ status: "active" }),
 *     [activeTab]           // re-fetch when these change
 *   );
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fetchFn  — async function to call
 * @param {any[]}  [deps]        — values that trigger a re-fetch when they change
 * @param {{
 *   immediate?: boolean,       — call fetchFn immediately on mount (default: true)
 *   initialData?: T | null,   — data before first fetch completes
 *   onSuccess?: (data: T) => void,
 *   onError?:   (err: Error)  => void,
 * }} [opts]
 * @returns {{ data: T|null, loading: boolean, error: Error|null, refetch: () => Promise<void> }}
 */
export function useFetch(fetchFn, deps = [], opts = {}) {
  const { immediate = true, initialData = null, onSuccess, onError } = opts;

  const [data, setData]       = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);

  const mountedRef = useRef(true);
  const fetchRef   = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRef.current();
      if (!mountedRef.current) return;
      setData(result);
      setLoading(false);
      onSuccess?.(result);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      onError?.(err);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) execute();
    return () => { mountedRef.current = false; };
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}

/**
 * Simplified variant that fetches once on mount, no re-fetch.
 * Best for static data that doesn't depend on user state.
 */
export function useOnce(fetchFn, initialData = null) {
  return useFetch(fetchFn, [], { immediate: true, initialData });
}
