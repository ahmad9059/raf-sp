"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getFoodScienceEquipment,
  getFoodScienceEquipmentById,
  createFoodScienceEquipment,
  updateFoodScienceEquipment,
  deleteFoodScienceEquipment,
  type FoodScienceEquipmentInput,
} from "@/actions/food-science";

// Query keys for Food Science
export const foodScienceQueryKeys = {
  all: () => ["food-science-equipment"] as const,
  byId: (id: string) => ["food-science-equipment", id] as const,
};

export interface FoodScienceEquipment {
  id: string;
  name: string;
  type: string;
  labSectionName: string | null;
  roomNumber: string | null;
  quantity: number;
  focalPerson: string | null;
  status: "AVAILABLE" | "IN_USE" | "NEEDS_REPAIR" | "DISCARDED";
  imageUrl: string | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Hook for fetching all Food Science equipment
export function useFoodScienceEquipment() {
  return useQuery({
    queryKey: foodScienceQueryKeys.all(),
    queryFn: async () => {
      const result = await getFoodScienceEquipment();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Food Science equipment");
      }
      return result.data as FoodScienceEquipment[];
    },
  });
}

// Hook for fetching Food Science equipment by ID
export function useFoodScienceEquipmentById(id: string) {
  return useQuery({
    queryKey: foodScienceQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getFoodScienceEquipmentById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Food Science equipment");
      }
      return result.data as FoodScienceEquipment;
    },
    enabled: !!id,
  });
}

// Hook for creating Food Science equipment
export function useCreateFoodScienceEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: FoodScienceEquipmentInput) => {
      const result = await createFoodScienceEquipment(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create equipment");
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
      queryClient.invalidateQueries({ queryKey: foodScienceQueryKeys.all() });
    },
  });
}

// Hook for updating Food Science equipment
export function useUpdateFoodScienceEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FoodScienceEquipmentInput }) => {
      const result = await updateFoodScienceEquipment(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update equipment");
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
      queryClient.invalidateQueries({ queryKey: foodScienceQueryKeys.all() });
    },
  });
}

// Hook for deleting Food Science equipment
export function useDeleteFoodScienceEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFoodScienceEquipment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete equipment");
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
      queryClient.invalidateQueries({ queryKey: foodScienceQueryKeys.all() });
    },
  });
}
