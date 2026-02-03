"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getMRIAssets,
  getMRIAssetById,
  createMRIAsset,
  updateMRIAsset,
  deleteMRIAsset,
  type MRIAssetInput,
} from "@/actions/mri";

// Query keys for MRI
export const mriQueryKeys = {
  all: () => ["mri-assets"] as const,
  byId: (id: string) => ["mri-assets", id] as const,
};

export interface MRIAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  itemNameOrDesignation: string | null;
  bpsScale: number | null;
  totalQuantityOrPosts: number | null;
  filledOrFunctional: number | null;
  vacantOrNonFunctional: number | null;
  remarksOrLocation: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all MRI assets
export function useMRIAssets() {
  return useQuery({
    queryKey: mriQueryKeys.all(),
    queryFn: async () => {
      const result = await getMRIAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch MRI assets");
      }
      return result.data as MRIAsset[];
    },
  });
}

// Hook for fetching MRI asset by ID
export function useMRIAssetById(id: string) {
  return useQuery({
    queryKey: mriQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getMRIAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch MRI asset");
      }
      return result.data as MRIAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating MRI asset
export function useCreateMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: MRIAssetInput) => {
      const result = await createMRIAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create MRI asset");
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
      queryClient.invalidateQueries({ queryKey: mriQueryKeys.all() });
    },
  });
}

// Hook for updating MRI asset
export function useUpdateMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MRIAssetInput }) => {
      const result = await updateMRIAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update MRI asset");
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
      queryClient.invalidateQueries({ queryKey: mriQueryKeys.all() });
    },
  });
}

// Hook for deleting MRI asset
export function useDeleteMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMRIAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete MRI asset");
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
      queryClient.invalidateQueries({ queryKey: mriQueryKeys.all() });
    },
  });
}
