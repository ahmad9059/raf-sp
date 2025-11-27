"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDashboardStats, getAllDepartmentsStats } from "@/actions/stats";

interface DashboardStats {
  totalEquipment: number;
  availableCount: number;
  inUseCount: number;
  needsRepairCount: number;
  discardedCount: number;
  equipmentByType: { type: string; count: number }[];
  recentEquipment: any[];
  totalMaintenanceCost: number;
}

// Hook for fetching dashboard stats
export function useDashboardStats(departmentId?: string) {
  return useQuery({
    queryKey: departmentId
      ? queryKeys.dashboardStatsByDepartment(departmentId)
      : queryKeys.dashboardStats(),
    queryFn: () => getDashboardStats(departmentId),
  });
}

// Hook for fetching dashboard stats across all departments
export function useAllDepartmentsStats() {
  return useQuery({
    queryKey: queryKeys.allDepartmentsStats(),
    queryFn: () => getAllDepartmentsStats(),
  });
}
