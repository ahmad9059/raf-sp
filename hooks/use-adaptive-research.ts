"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  createAdaptiveResearchPosition,
  deleteAdaptiveResearchPosition,
  getAdaptiveResearchPositionById,
  getAdaptiveResearchPositions,
  updateAdaptiveResearchPosition,
  type AdaptiveResearchPositionInput,
} from "@/actions/adaptive-research";

export const adaptiveResearchQueryKeys = {
  all: () => ["adaptive-research-positions"] as const,
  byId: (id: string) => ["adaptive-research-positions", id] as const,
};

export interface AdaptiveResearchPosition {
  id: string;
  attachedDepartment: string | null;
  postName: string;
  bpsScale: string;
  sanctionedPosts: number;
  filledPosts: number;
  vacantPosts: number;
  promotionPosts: number;
  initialRecruitmentPosts: number;
  remarks: string | null;
  orderNumber: number | null;
  departmentId: string;
  department: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function useAdaptiveResearchPositions() {
  return useQuery({
    queryKey: adaptiveResearchQueryKeys.all(),
    queryFn: async () => {
      const result = await getAdaptiveResearchPositions();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Adaptive Research positions");
      }
      return result.data as AdaptiveResearchPosition[];
    },
  });
}

export function useAdaptiveResearchPositionById(id: string) {
  return useQuery({
    queryKey: adaptiveResearchQueryKeys.byId(id),
    queryFn: async () => {
      const result = await getAdaptiveResearchPositionById(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch Adaptive Research position");
      }
      return result.data as AdaptiveResearchPosition;
    },
    enabled: !!id,
  });
}

export function useCreateAdaptiveResearchPosition() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: AdaptiveResearchPositionInput) => {
      const result = await createAdaptiveResearchPosition(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create Adaptive Research position");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create position");
    },
    onSuccess: () => {
      success("Position created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adaptiveResearchQueryKeys.all() });
    },
  });
}

export function useUpdateAdaptiveResearchPosition() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AdaptiveResearchPositionInput }) => {
      const result = await updateAdaptiveResearchPosition(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update Adaptive Research position");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to update position");
    },
    onSuccess: () => {
      success("Position updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adaptiveResearchQueryKeys.all() });
    },
  });
}

export function useDeleteAdaptiveResearchPosition() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAdaptiveResearchPosition(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete Adaptive Research position");
      }
      return result;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to delete position");
    },
    onSuccess: () => {
      success("Position deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adaptiveResearchQueryKeys.all() });
    },
  });
}
