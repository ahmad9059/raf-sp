"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getSoilWaterProjects,
  getSoilWaterProjectById,
  createSoilWaterProject,
  updateSoilWaterProject,
  deleteSoilWaterProject,
  type SoilWaterProjectInput,
} from "@/actions/soil-water";

// Query keys for Soil Water
export const soilWaterQueryKeys = {
  all: () => ["soil-water-projects"] as const,
  byId: (id: string) => ["soil-water-projects", id] as const,
};

export interface SoilWaterProject {
  id: string;
  name: string;
  type: string;
  category: string | null;
  bps: number | null;
  quantityRequired: number | null;
  budgetAllocationTotalMillion: number | null;
  justificationOrYear: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Soil Water projects
export function useSoilWaterProjects() {
  return useQuery({
    queryKey: soilWaterQueryKeys.all(),
    queryFn: async () => {
      const result = await getSoilWaterProjects();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Soil & Water projects");
      }
      return result.data as SoilWaterProject[];
    },
  });
}

// Hook for fetching Soil Water project by ID
export function useSoilWaterProjectById(id: string) {
  return useQuery({
    queryKey: soilWaterQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getSoilWaterProjectById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Soil & Water project");
      }
      return result.data as SoilWaterProject;
    },
    enabled: !!id,
  });
}

// Hook for creating Soil Water project
export function useCreateSoilWaterProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: SoilWaterProjectInput) => {
      const result = await createSoilWaterProject(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Soil & Water project");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create project");
    },
    onSuccess: () => {
      success("Project created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: soilWaterQueryKeys.all() });
    },
  });
}

// Hook for updating Soil Water project
export function useUpdateSoilWaterProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SoilWaterProjectInput }) => {
      const result = await updateSoilWaterProject(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Soil & Water project");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update project");
    },
    onSuccess: () => {
      success("Project updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: soilWaterQueryKeys.all() });
    },
  });
}

// Hook for deleting Soil Water project
export function useDeleteSoilWaterProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSoilWaterProject(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Soil & Water project");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete project");
    },
    onSuccess: () => {
      success("Project deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: soilWaterQueryKeys.all() });
    },
  });
}
