"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/actions/department";

interface Department {
  id: string;
  name: string;
  location: string;
  logo?: string | null;
  _count: {
    equipment: number;
    users: number;
  };
}

interface DepartmentInput {
  name: string;
  location: string;
  logo?: string;
}

// Hook for fetching all departments
export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments.all(),
    queryFn: async () => {
      const result = await getDepartments();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch departments");
      }
      return result.data as Department[];
    },
  });
}

// Hook for creating department with optimistic updates
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: DepartmentInput) => {
      const result = await createDepartment(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create department");
      }
      return result.data;
    },
    onMutate: async (newDepartment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.departments.all(),
      });

      // Snapshot the previous value
      const previousDepartments = queryClient.getQueryData(
        queryKeys.departments.all()
      );

      // Optimistically update to the new value
      const optimisticDepartment = {
        id: `temp-${Date.now()}`, // Temporary ID
        ...newDepartment,
        _count: { equipment: 0, users: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(
        queryKeys.departments.all(),
        (old: Department[] = []) => [optimisticDepartment as Department, ...old]
      );

      return { previousDepartments };
    },
    onError: (err, newDepartment, context) => {
      // Roll back on error
      queryClient.setQueryData(
        queryKeys.departments.all(),
        context?.previousDepartments
      );
      error(err instanceof Error ? err.message : "Failed to create department");
    },
    onSuccess: () => {
      success("Department created successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
    },
  });
}

// Hook for updating department with optimistic updates
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DepartmentInput }) => {
      const result = await updateDepartment(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update department");
      }
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.departments.all(),
      });

      // Snapshot the previous value
      const previousDepartments = queryClient.getQueryData(
        queryKeys.departments.all()
      );

      // Optimistically update the department
      queryClient.setQueryData(
        queryKeys.departments.all(),
        (old: Department[] = []) =>
          old.map((department) =>
            department.id === id
              ? { ...department, ...data, updatedAt: new Date() }
              : department
          )
      );

      return { previousDepartments };
    },
    onError: (err, { id }, context) => {
      // Roll back on error
      queryClient.setQueryData(
        queryKeys.departments.all(),
        context?.previousDepartments
      );
      error(err instanceof Error ? err.message : "Failed to update department");
    },
    onSuccess: () => {
      success("Department updated successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
    },
  });
}

// Hook for deleting department with optimistic updates
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteDepartment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete department");
      }
      return result;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.departments.all(),
      });

      // Snapshot the previous value
      const previousDepartments = queryClient.getQueryData(
        queryKeys.departments.all()
      );

      // Optimistically remove the department
      queryClient.setQueryData(
        queryKeys.departments.all(),
        (old: Department[] = []) =>
          old.filter((department) => department.id !== id)
      );

      return { previousDepartments };
    },
    onError: (err, id, context) => {
      // Roll back on error
      queryClient.setQueryData(
        queryKeys.departments.all(),
        context?.previousDepartments
      );
      error(err instanceof Error ? err.message : "Failed to delete department");
    },
    onSuccess: () => {
      success("Department deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
    },
  });
}
