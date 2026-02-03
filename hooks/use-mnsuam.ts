"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getMNSUAMFacilities,
  getMNSUAMFacilityById,
  createMNSUAMFacility,
  updateMNSUAMFacility,
  deleteMNSUAMFacility,
  type MNSUAMFacilityInput,
} from "@/actions/mnsuam";

// Query keys for MNSUAM
export const mnsuamQueryKeys = {
  all: () => ["mnsuam-facilities"] as const,
  byId: (id: string) => ["mnsuam-facilities", id] as const,
};

export interface MNSUAMFacility {
  id: string;
  name: string;
  type: string;
  blockName: string | null;
  facilityType: string | null;
  capacityPersons: number | null;
  capacityLabel: string | null;
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

// Hook for fetching all MNSUAM facilities
export function useMNSUAMFacilities() {
  return useQuery({
    queryKey: mnsuamQueryKeys.all(),
    queryFn: async () => {
      const result = await getMNSUAMFacilities();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch MNSUAM facilities");
      }
      return result.data as MNSUAMFacility[];
    },
  });
}

// Hook for fetching MNSUAM facility by ID
export function useMNSUAMFacilityById(id: string) {
  return useQuery({
    queryKey: mnsuamQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getMNSUAMFacilityById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch MNSUAM facility");
      }
      return result.data as MNSUAMFacility;
    },
    enabled: !!id,
  });
}

// Hook for creating MNSUAM facility
export function useCreateMNSUAMFacility() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: MNSUAMFacilityInput) => {
      const result = await createMNSUAMFacility(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create MNSUAM facility");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create facility");
    },
    onSuccess: () => {
      success("Facility created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: mnsuamQueryKeys.all() });
    },
  });
}

// Hook for updating MNSUAM facility
export function useUpdateMNSUAMFacility() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MNSUAMFacilityInput }) => {
      const result = await updateMNSUAMFacility(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update MNSUAM facility");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update facility");
    },
    onSuccess: () => {
      success("Facility updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: mnsuamQueryKeys.all() });
    },
  });
}

// Hook for deleting MNSUAM facility
export function useDeleteMNSUAMFacility() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMNSUAMFacility(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete MNSUAM facility");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete facility");
    },
    onSuccess: () => {
      success("Facility deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: mnsuamQueryKeys.all() });
    },
  });
}
