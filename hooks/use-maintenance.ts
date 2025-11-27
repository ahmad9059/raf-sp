"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  deleteMaintenanceLog,
} from "@/actions/maintenance";
import { MaintenanceLog } from "@prisma/client";

interface MaintenanceLogInput {
  equipmentId: string;
  date: Date;
  cost: number;
  description: string;
}

// Hook for fetching maintenance logs by equipment ID
export function useMaintenanceLogs(equipmentId: string) {
  return useQuery({
    queryKey: queryKeys.maintenanceLogs.byEquipment(equipmentId),
    queryFn: async () => {
      const result = await getMaintenanceLogs(equipmentId);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch maintenance logs");
      }
      return result.data as { logs: MaintenanceLog[]; totalCost: number };
    },
    enabled: !!equipmentId,
  });
}

// Hook for creating maintenance log
export function useCreateMaintenanceLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MaintenanceLogInput) => {
      const result = await createMaintenanceLog(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create maintenance log");
      }
      return result.data;
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to create maintenance log",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance log created successfully",
      });
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.maintenanceLogs.byEquipment(variables.equipmentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.equipment.byId(variables.equipmentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}

// Hook for deleting maintenance log
export function useDeleteMaintenanceLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      equipmentId,
    }: {
      id: string;
      equipmentId: string;
    }) => {
      const result = await deleteMaintenanceLog(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete maintenance log");
      }
      return result;
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to delete maintenance log",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance log deleted successfully",
      });
    },
    onSettled: (data, error, { equipmentId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.maintenanceLogs.byEquipment(equipmentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.equipment.byId(equipmentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() });
    },
  });
}
