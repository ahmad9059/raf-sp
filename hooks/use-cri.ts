"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getCRIAssets,
  getCRIAssetById,
  createCRIAsset,
  updateCRIAsset,
  deleteCRIAsset,
  type CRIAssetInput,
} from "@/actions/cri";

// Query keys for CRI
export const criQueryKeys = {
  all: () => ["cri-assets"] as const,
  byId: (id: string) => ["cri-assets", id] as const,
};

export interface CRIAsset {
  id: string;
  name: string;
  type: string;
  imageUrl: string | null;
  departmentId: string;
  makeModel: string | null;
  labDepartment: string | null;
  purposeFunction: string | null;
  year: string | null;
  location: string | null;
  quantity: number;
  operationalStatus: string | null;
  description: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all CRI assets
export function useCRIAssets() {
  return useQuery({
    queryKey: criQueryKeys.all(),
    queryFn: async () => {
      const result = await getCRIAssets();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch CRI assets");
      }
      return result.data as CRIAsset[];
    },
  });
}

// Hook for fetching CRI asset by ID
export function useCRIAssetById(id: string) {
  return useQuery({
    queryKey: criQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getCRIAssetById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch CRI asset");
      }
      return result.data as CRIAsset;
    },
    enabled: !!id,
  });
}

// Hook for creating CRI asset
export function useCreateCRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: CRIAssetInput) => {
      const result = await createCRIAsset(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create CRI asset");
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
      queryClient.invalidateQueries({ queryKey: criQueryKeys.all() });
    },
  });
}

// Hook for updating CRI asset
export function useUpdateCRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CRIAssetInput }) => {
      const result = await updateCRIAsset(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update CRI asset");
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
      queryClient.invalidateQueries({ queryKey: criQueryKeys.all() });
    },
  });
}

// Hook for deleting CRI asset
export function useDeleteCRIAsset() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCRIAsset(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete CRI asset");
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
      queryClient.invalidateQueries({ queryKey: criQueryKeys.all() });
    },
  });
}
