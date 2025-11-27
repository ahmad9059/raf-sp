"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  bulkImportEquipment,
} from "@/actions/equipment";
import { EquipmentStatus } from "@prisma/client";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string | null;
  departmentId: string;
  department: {
    id: string;
    name: string;
    location: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface EquipmentInput {
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string;
  departmentId: string;
}

// Hook for fetching all equipment
export function useEquipment() {
  return useQuery({
    queryKey: queryKeys.equipment.all(),
    queryFn: async () => {
      const result = await getEquipment();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch equipment");
      }
      return result.data as Equipment[];
    },
  });
}

// Hook for fetching equipment by ID
export function useEquipmentById(id: string) {
  return useQuery({
    queryKey: queryKeys.equipment.byId(id),
    queryFn: async () => {
      const result = await getEquipmentById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch equipment");
      }
      return result.data as Equipment;
    },
    enabled: !!id,
  });
}

// Hook for creating equipment with optimistic updates
export function useCreateEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: EquipmentInput) => {
      const result = await createEquipment(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create equipment");
      }
      return result.data;
    },
    onMutate: async (newEquipment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.equipment.all() });

      // Snapshot the previous value
      const previousEquipment = queryClient.getQueryData(
        queryKeys.equipment.all()
      );

      // Optimistically update to the new value
      const optimisticEquipment = {
        id: `temp-${Date.now()}`, // Temporary ID
        ...newEquipment,
        department: { name: "Loading..." }, // Placeholder
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(
        queryKeys.equipment.all(),
        (old: Equipment[] = []) => [optimisticEquipment as Equipment, ...old]
      );

      // Return a context object with the snapshotted value
      return { previousEquipment };
    },
    onError: (err, newEquipment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        queryKeys.equipment.all(),
        context?.previousEquipment
      );
      error(err instanceof Error ? err.message : "Failed to create equipment");
    },
    onSuccess: (data) => {
      success("Equipment created successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}

// Hook for updating equipment with optimistic updates
export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EquipmentInput }) => {
      const result = await updateEquipment(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update equipment");
      }
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.equipment.all() });
      await queryClient.cancelQueries({
        queryKey: queryKeys.equipment.byId(id),
      });

      // Snapshot the previous values
      const previousEquipment = queryClient.getQueryData(
        queryKeys.equipment.all()
      );
      const previousSingleEquipment = queryClient.getQueryData(
        queryKeys.equipment.byId(id)
      );

      // Optimistically update the equipment list
      queryClient.setQueryData(
        queryKeys.equipment.all(),
        (old: Equipment[] = []) =>
          old.map((equipment) =>
            equipment.id === id
              ? { ...equipment, ...data, updatedAt: new Date() }
              : equipment
          )
      );

      // Optimistically update the single equipment
      queryClient.setQueryData(
        queryKeys.equipment.byId(id),
        (old: Equipment | undefined) =>
          old ? { ...old, ...data, updatedAt: new Date() } : undefined
      );

      return { previousEquipment, previousSingleEquipment };
    },
    onError: (err, { id }, context) => {
      // Roll back on error
      queryClient.setQueryData(
        queryKeys.equipment.all(),
        context?.previousEquipment
      );
      queryClient.setQueryData(
        queryKeys.equipment.byId(id),
        context?.previousSingleEquipment
      );
      error(err instanceof Error ? err.message : "Failed to update equipment");
    },
    onSuccess: () => {
      success("Equipment updated successfully");
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}

// Hook for deleting equipment with optimistic updates
export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEquipment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete equipment");
      }
      return result;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.equipment.all() });

      // Snapshot the previous value
      const previousEquipment = queryClient.getQueryData(
        queryKeys.equipment.all()
      );

      // Optimistically remove the equipment
      queryClient.setQueryData(
        queryKeys.equipment.all(),
        (old: Equipment[] = []) =>
          old.filter((equipment) => equipment.id !== id)
      );

      return { previousEquipment };
    },
    onError: (err, id, context) => {
      // Roll back on error
      queryClient.setQueryData(
        queryKeys.equipment.all(),
        context?.previousEquipment
      );
      error(err instanceof Error ? err.message : "Failed to delete equipment");
    },
    onSuccess: () => {
      success("Equipment deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}

// Hook for bulk import
export function useBulkImportEquipment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await bulkImportEquipment(formData);
      if (!result.success) {
        throw new Error(result.message || "Failed to import equipment");
      }
      return result.data;
    },
    onSuccess: (data) => {
      success(`Successfully imported ${data?.imported || 0} equipment items`);
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to import equipment");
    },
    onSettled: () => {
      // Refetch all equipment-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}
