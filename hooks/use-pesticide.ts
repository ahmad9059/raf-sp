"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getPesticideData,
  getPesticideDataById,
  createPesticideData,
  updatePesticideData,
  deletePesticideData,
  type PesticideDataInput,
} from "@/actions/pesticide";

// Query keys for Pesticide QC Lab
export const pesticideQueryKeys = {
  all: () => ["pesticide-data"] as const,
  byId: (id: string) => ["pesticide-data", id] as const,
};

export interface PesticideData {
  id: string;
  name: string;
  type: string;
  sectionCategory: string | null;
  bpsScale: number | null;
  quantityOrSanctioned: number | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Pesticide QC Lab data
export function usePesticideData() {
  return useQuery({
    queryKey: pesticideQueryKeys.all(),
    queryFn: async () => {
      const result = await getPesticideData();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Pesticide QC Lab data");
      }
      return result.data as PesticideData[];
    },
  });
}

// Hook for fetching Pesticide data by ID
export function usePesticideDataById(id: string) {
  return useQuery({
    queryKey: pesticideQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getPesticideDataById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Pesticide QC Lab record");
      }
      return result.data as PesticideData;
    },
    enabled: !!id,
  });
}

// Hook for creating Pesticide data
export function useCreatePesticideData() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: PesticideDataInput) => {
      const result = await createPesticideData(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Pesticide QC Lab record");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create record");
    },
    onSuccess: () => {
      success("Record created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pesticideQueryKeys.all() });
    },
  });
}

// Hook for updating Pesticide data
export function useUpdatePesticideData() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PesticideDataInput }) => {
      const result = await updatePesticideData(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Pesticide QC Lab record");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update record");
    },
    onSuccess: () => {
      success("Record updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pesticideQueryKeys.all() });
    },
  });
}

// Hook for deleting Pesticide data
export function useDeletePesticideData() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePesticideData(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Pesticide QC Lab record");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete record");
    },
    onSuccess: () => {
      success("Record deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pesticideQueryKeys.all() });
    },
  });
}
