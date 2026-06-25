"use client";

import { useCallback } from "react";
import { useFetch } from "./useFetch";
import {
  getOrders,
  getOrderById,
  cancelOrder as apiCancelOrder,
  reorder as apiReorder,
} from "@/lib/api/orders";

/**
 * Hook for the order history list.
 * Automatically re-fetches when filters change.
 *
 * @param {{ status?: string, search?: string }} [filters]
 */
export function useOrders(filters = {}) {
  const fetchFn = useCallback(
    () => getOrders(filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.status, filters.search]
  );

  const { data, loading, error, refetch } = useFetch(fetchFn, [
    filters.status,
    filters.search,
  ]);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for a single order's detail view.
 *
 * @param {string} id — order ID
 */
export function useOrder(id) {
  const fetchFn = useCallback(() => getOrderById(id), [id]);
  const { data: order, loading, error, refetch } = useFetch(fetchFn, [id]);

  const cancelOrder = useCallback(
    async (reason) => {
      const updated = await apiCancelOrder(id, { reason });
      await refetch();
      return updated;
    },
    [id, refetch]
  );

  const reorder = useCallback(async () => {
    const result = await apiReorder(id);
    return result;
  }, [id]);

  return { order, loading, error, cancelOrder, reorder, refetch };
}
