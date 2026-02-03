"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getFloricultureAssets,
  getFloricultureAssetById,
  createFloricultureAsset,
  updateFloricultureAsset,
  deleteFloricultureAsset,
  type FloricultureAssetInput,
} from "@/actions/floriculture";

// Query keys for Floriculture
export const floricultureQueryKeys = {
  all: () => ["floriculture-assets"] as const,
  byId: (id: string) => ["floriculture-assets", id] as const,
};

export interface FloricultureAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  itemNameOrPost: string | null;
  bpsScale: string | null;
  sanctionedQty: number | null;
  inPositionQty: number | null;
  detailsOrArea: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Floriculture assets
export function useFloricultureAssets() {
  return useQuery({
    queryKey: floricultureQueryKeys.all(),
    queryFn: async () => {
      const result = await getFloricultureAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Floriculture assets");
      }
      return result.data as FloricultureAsset[];
    },
  });
}

// Hook for fetching Floriculture asset by ID
export function useFloricultureAssetById(id: string) {
  return useQuery({
    queryKey: floricultureQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getFloricultureAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Floriculture asset");
      }
      return result.data as FloricultureAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating Floriculture asset
export function useCreateFloricultureAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: FloricultureAssetInput) => {
      const result = await createFloricultureAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Floriculture asset");
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
      queryClient.invalidateQueries({ queryKey: floricultureQueryKeys.all() });
    },
  });
}

// Hook for updating Floriculture asset
export function useUpdateFloricultureAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FloricultureAssetInput }) => {
      const result = await updateFloricultureAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Floriculture asset");
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
      queryClient.invalidateQueries({ queryKey: floricultureQueryKeys.all() });
    },
  });
}

// Hook for deleting Floriculture asset
export function useDeleteFloricultureAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFloricultureAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Floriculture asset");
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
      queryClient.invalidateQueries({ queryKey: floricultureQueryKeys.all() });
    },
  });
}
