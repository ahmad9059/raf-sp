"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getAgriEngineeringAssets,
  getAgriEngineeringAssetById,
  createAgriEngineeringAsset,
  updateAgriEngineeringAsset,
  deleteAgriEngineeringAsset,
  type AgriEngineeringAssetInput,
} from "@/actions/agri-engineering";

// Query keys for Agri Engineering
export const agriEngineeringQueryKeys = {
  all: () => ["agri-engineering-assets"] as const,
  byId: (id: string) => ["agri-engineering-assets", id] as const,
};

export interface AgriEngineeringAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  divisionOrCity: string | null;
  officeName: string | null;
  quantityOrArea: string | null;
  contactDetails: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Agri Engineering assets
export function useAgriEngineeringAssets() {
  return useQuery({
    queryKey: agriEngineeringQueryKeys.all(),
    queryFn: async () => {
      const result = await getAgriEngineeringAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agricultural Engineering assets");
      }
      return result.data as AgriEngineeringAsset[];
    },
  });
}

// Hook for fetching Agri Engineering asset by ID
export function useAgriEngineeringAssetById(id: string) {
  return useQuery({
    queryKey: agriEngineeringQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getAgriEngineeringAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agricultural Engineering asset");
      }
      return result.data as AgriEngineeringAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating Agri Engineering asset
export function useCreateAgriEngineeringAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: AgriEngineeringAssetInput) => {
      const result = await createAgriEngineeringAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Agricultural Engineering asset");
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
      queryClient.invalidateQueries({ queryKey: agriEngineeringQueryKeys.all() });
    },
  });
}

// Hook for updating Agri Engineering asset
export function useUpdateAgriEngineeringAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AgriEngineeringAssetInput }) => {
      const result = await updateAgriEngineeringAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Agricultural Engineering asset");
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
      queryClient.invalidateQueries({ queryKey: agriEngineeringQueryKeys.all() });
    },
  });
}

// Hook for deleting Agri Engineering asset
export function useDeleteAgriEngineeringAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAgriEngineeringAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Agricultural Engineering asset");
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
      queryClient.invalidateQueries({ queryKey: agriEngineeringQueryKeys.all() });
    },
  });
}
