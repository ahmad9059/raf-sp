"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getAgronomyEquipment,
  getAgronomyEquipmentById,
  createAgronomyEquipment,
  updateAgronomyEquipment,
  deleteAgronomyEquipment,
  type AgronomyEquipmentInput,
} from "@/actions/agronomy";

// Query keys for Agronomy
export const agronomyQueryKeys = {
  all: () => ["agronomy-equipment"] as const,
  byId: (id: string) => ["agronomy-equipment", id] as const,
};

export interface AgronomyEquipment {
  id: string;
  name: string;
  type: string;
  quantity: number | null;
  focalPerson1: string | null;
  displayOrder: number | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Agronomy equipment
export function useAgronomyEquipment() {
  return useQuery({
    queryKey: agronomyQueryKeys.all(),
    queryFn: async () => {
      const result = await getAgronomyEquipment();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agronomy equipment");
      }
      return result.data as AgronomyEquipment[];
    },
  });
}

// Hook for fetching Agronomy equipment by ID
export function useAgronomyEquipmentById(id: string) {
  return useQuery({
    queryKey: agronomyQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getAgronomyEquipmentById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Agronomy equipment");
      }
      return result.data as AgronomyEquipment;
    },
    enabled: !!id,
  });
}

// Hook for creating Agronomy equipment
export function useCreateAgronomyEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: AgronomyEquipmentInput) => {
      const result = await createAgronomyEquipment(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Agronomy equipment");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create equipment");
    },
    onSuccess: () => {
      success("Equipment created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agronomyQueryKeys.all() });
    },
  });
}

// Hook for updating Agronomy equipment
export function useUpdateAgronomyEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AgronomyEquipmentInput }) => {
      const result = await updateAgronomyEquipment(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Agronomy equipment");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update equipment");
    },
    onSuccess: () => {
      success("Equipment updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agronomyQueryKeys.all() });
    },
  });
}

// Hook for deleting Agronomy equipment
export function useDeleteAgronomyEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAgronomyEquipment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Agronomy equipment");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete equipment");
    },
    onSuccess: () => {
      success("Equipment deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agronomyQueryKeys.all() });
    },
  });
}
