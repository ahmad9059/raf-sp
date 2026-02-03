"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getERSSStockItems,
  getERSSStockItemById,
  createERSSStockItem,
  updateERSSStockItem,
  deleteERSSStockItem,
  type ERSSStockInput,
} from "@/actions/entomology";

// Query keys for Entomology/ERSS
export const entomologyQueryKeys = {
  all: () => ["erss-stock-items"] as const,
  byId: (id: string) => ["erss-stock-items", id] as const,
};

export interface ERSSStockItem {
  id: string;
  name: string;
  type: string;
  quantityStr: string | null;
  dateReceived: Date | null;
  lastVerificationDate: string | null;
  currentStatusRemarks: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all ERSS stock items
export function useERSSStockItems() {
  return useQuery({
    queryKey: entomologyQueryKeys.all(),
    queryFn: async () => {
      const result = await getERSSStockItems();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch stock items");
      }
      return result.data as ERSSStockItem[];
    },
  });
}

// Hook for fetching ERSS stock item by ID
export function useERSSStockItemById(id: string) {
  return useQuery({
    queryKey: entomologyQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getERSSStockItemById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch stock item");
      }
      return result.data as ERSSStockItem;
    },
    enabled: !!id,
  });
}

// Hook for creating ERSS stock item
export function useCreateERSSStockItem() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: ERSSStockInput) => {
      const result = await createERSSStockItem(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create stock item");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create stock item");
    },
    onSuccess: () => {
      success("Stock item created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: entomologyQueryKeys.all() });
    },
  });
}

// Hook for updating ERSS stock item
export function useUpdateERSSStockItem() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ERSSStockInput }) => {
      const result = await updateERSSStockItem(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update stock item");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update stock item");
    },
    onSuccess: () => {
      success("Stock item updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: entomologyQueryKeys.all() });
    },
  });
}

// Hook for deleting ERSS stock item
export function useDeleteERSSStockItem() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteERSSStockItem(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete stock item");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete stock item");
    },
    onSuccess: () => {
      success("Stock item deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: entomologyQueryKeys.all() });
    },
  });
}
