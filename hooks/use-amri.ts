"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getAMRIAssets,
  getAMRIAssetById,
  createAMRIAsset,
  updateAMRIAsset,
  deleteAMRIAsset,
  type AMRIAssetInput,
} from "@/actions/amri";

// Query keys for AMRI
export const amriQueryKeys = {
  all: () => ["amri-assets"] as const,
  byId: (id: string) => ["amri-assets", id] as const,
};

export interface AMRIAsset {
  id: string;
  name: string;
  type: string;
  assetCategory: string | null;
  itemDescription: string | null;
  quantityOrArea: string | null;
  functionalStatus: string | null;
  remarks: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all AMRI assets
export function useAMRIAssets() {
  return useQuery({
    queryKey: amriQueryKeys.all(),
    queryFn: async () => {
      const result = await getAMRIAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch AMRI assets");
      }
      return result.data as AMRIAsset[];
    },
  });
}

// Hook for fetching AMRI asset by ID
export function useAMRIAssetById(id: string) {
  return useQuery({
    queryKey: amriQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getAMRIAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch AMRI asset");
      }
      return result.data as AMRIAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating AMRI asset
export function useCreateAMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: AMRIAssetInput) => {
      const result = await createAMRIAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create AMRI asset");
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
      queryClient.invalidateQueries({ queryKey: amriQueryKeys.all() });
    },
  });
}

// Hook for updating AMRI asset
export function useUpdateAMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AMRIAssetInput }) => {
      const result = await updateAMRIAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update AMRI asset");
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
      queryClient.invalidateQueries({ queryKey: amriQueryKeys.all() });
    },
  });
}

// Hook for deleting AMRI asset
export function useDeleteAMRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAMRIAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete AMRI asset");
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
      queryClient.invalidateQueries({ queryKey: amriQueryKeys.all() });
    },
  });
}
