"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getAgriExtensionAssets,
  getAgriExtensionAssetById,
  createAgriExtensionAsset,
  updateAgriExtensionAsset,
  deleteAgriExtensionAsset,
  type AgriExtensionAssetInput,
} from "@/actions/agri-extension";

// Query keys for Agricultural Extension Wing
export const agriExtensionQueryKeys = {
  all: () => ["agri-extension-assets"] as const,
  byId: (id: string) => ["agri-extension-assets", id] as const,
};

export interface AgriExtensionAsset {
  id: string;
  name: string;
  type: string;
  location: string;
  areaSquareFeet: number | null;
  remarks: string | null;
  status: string; // Utilized, Unused, etc.
  functionality: string | null;
  equipmentStatus: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Agricultural Extension Wing assets
export function useAgriExtensionAssets() {
  return useQuery({
    queryKey: agriExtensionQueryKeys.all(),
    queryFn: async () => {
      const result = await getAgriExtensionAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agricultural Extension Wing assets");
      }
      return result.data as AgriExtensionAsset[];
    },
  });
}

// Hook for fetching Agricultural Extension Wing asset by ID
export function useAgriExtensionAssetById(id: string) {
  return useQuery({
    queryKey: agriExtensionQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getAgriExtensionAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agricultural Extension Wing asset");
      }
      return result.data as AgriExtensionAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating Agricultural Extension Wing asset
export function useCreateAgriExtensionAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: AgriExtensionAssetInput) => {
      const result = await createAgriExtensionAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Agricultural Extension Wing asset");
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
      queryClient.invalidateQueries({ queryKey: agriExtensionQueryKeys.all() });
    },
  });
}

// Hook for updating Agricultural Extension Wing asset
export function useUpdateAgriExtensionAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AgriExtensionAssetInput }) => {
      const result = await updateAgriExtensionAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Agricultural Extension Wing asset");
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
      queryClient.invalidateQueries({ queryKey: agriExtensionQueryKeys.all() });
    },
  });
}

// Hook for deleting Agricultural Extension Wing asset
export function useDeleteAgriExtensionAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAgriExtensionAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Agricultural Extension Wing asset");
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
      queryClient.invalidateQueries({ queryKey: agriExtensionQueryKeys.all() });
    },
  });
}
