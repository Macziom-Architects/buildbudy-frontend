"use client";

import { useCallback } from "react";
import { useFetch } from "./useFetch";
import {
  getNotifications,
  markRead as apiMarkRead,
  markAllRead as apiMarkAllRead,
  deleteNotification as apiDelete,
} from "@/lib/api/notifications";

/**
 * Hook for the notifications list.
 * Handles mark-read, mark-all-read, and delete optimistically.
 *
 * @param {{ type?: string, unreadOnly?: boolean }} [filters]
 */
export function useNotifications(filters = {}) {
  const fetchFn = useCallback(
    () => getNotifications(filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.type, filters.unreadOnly]
  );

  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useFetch(fetchFn, [filters.type, filters.unreadOnly], {
    initialData: [],
  });

  const markRead = useCallback(
    async (id) => {
      await apiMarkRead(id);
      await refetch();
    },
    [refetch]
  );

  const markAllRead = useCallback(async () => {
    await apiMarkAllRead();
    await refetch();
  }, [refetch]);

  const deleteNotification = useCallback(
    async (id) => {
      await apiDelete(id);
      await refetch();
    },
    [refetch]
  );

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  return {
    notifications: notifications ?? [],
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    deleteNotification,
    refetch,
  };
}
