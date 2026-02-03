"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getRARIAssets,
  getRARIAssetById,
  createRARIAsset,
  updateRARIAsset,
  deleteRARIAsset,
  type RARIAssetInput,
} from "@/actions/rari";

// Query keys for RARI
export const rariQueryKeys = {
  all: () => ["rari-assets"] as const,
  byId: (id: string) => ["rari-assets", id] as const,
};

export interface RARIAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  makeModelYear: string | null;
  quantity: number | null;
  conditionStatus: string | null;
  useApplication: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all RARI assets
export function useRARIAssets() {
  return useQuery({
    queryKey: rariQueryKeys.all(),
    queryFn: async () => {
      const result = await getRARIAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch RARI assets");
      }
      return result.data as RARIAsset[];
    },
  });
}

// Hook for fetching RARI asset by ID
export function useRARIAssetById(id: string) {
  return useQuery({
    queryKey: rariQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getRARIAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch RARI asset");
      }
      return result.data as RARIAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating RARI asset
export function useCreateRARIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: RARIAssetInput) => {
      const result = await createRARIAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create RARI asset");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create asset");
    },
    onSuccess: () => {
      success("Asset created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rariQueryKeys.all() });
    },
  });
}

// Hook for updating RARI asset
export function useUpdateRARIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RARIAssetInput }) => {
      const result = await updateRARIAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update RARI asset");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update asset");
    },
    onSuccess: () => {
      success("Asset updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rariQueryKeys.all() });
    },
  });
}

// Hook for deleting RARI asset
export function useDeleteRARIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteRARIAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete RARI asset");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete asset");
    },
    onSuccess: () => {
      success("Asset deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rariQueryKeys.all() });
    },
  });
}
