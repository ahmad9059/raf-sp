"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getRAEDCEquipment,
  getRAEDCEquipmentById,
  createRAEDCEquipment,
  updateRAEDCEquipment,
  deleteRAEDCEquipment,
  type RAEDCEquipmentInput,
} from "@/actions/raedc";

// Query keys for RAEDC
export const raedcQueryKeys = {
  all: () => ["raedc-equipment"] as const,
  byId: (id: string) => ["raedc-equipment", id] as const,
};

export interface RAEDCEquipment {
  id: string;
  name: string;
  type: string;
  facilityType: string | null;
  capacity: number | null;
  location: string | null;
  functionality: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all RAEDC equipment
export function useRAEDCEquipment() {
  return useQuery({
    queryKey: raedcQueryKeys.all(),
    queryFn: async () => {
      const result = await getRAEDCEquipment();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch RAEDC equipment");
      }
      return result.data as RAEDCEquipment[];
    },
  });
}

// Hook for fetching RAEDC equipment by ID
export function useRAEDCEquipmentById(id: string) {
  return useQuery({
    queryKey: raedcQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getRAEDCEquipmentById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch RAEDC equipment");
      }
      return result.data as RAEDCEquipment;
    },
    enabled: !!id,
  });
}

// Hook for creating RAEDC equipment
export function useCreateRAEDCEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: RAEDCEquipmentInput) => {
      const result = await createRAEDCEquipment(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create RAEDC equipment");
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
      queryClient.invalidateQueries({ queryKey: raedcQueryKeys.all() });
    },
  });
}

// Hook for updating RAEDC equipment
export function useUpdateRAEDCEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RAEDCEquipmentInput }) => {
      const result = await updateRAEDCEquipment(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update RAEDC equipment");
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
      queryClient.invalidateQueries({ queryKey: raedcQueryKeys.all() });
    },
  });
}

// Hook for deleting RAEDC equipment
export function useDeleteRAEDCEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteRAEDCEquipment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete RAEDC equipment");
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
      queryClient.invalidateQueries({ queryKey: raedcQueryKeys.all() });
    },
  });
}
