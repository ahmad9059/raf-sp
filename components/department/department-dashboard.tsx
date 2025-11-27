"use client";

import { useDashboardStats } from "@/hooks/use-dashboard";
import {
  StatsOverview,
  StatsOverviewSkeleton,
} from "@/components/dashboard/stats-overview";
import {
  EquipmentStatusChart,
  EquipmentStatusChartSkeleton,
} from "@/components/dashboard/equipment-status-chart";
import {
  EquipmentTypeChart,
  EquipmentTypeChartSkeleton,
} from "@/components/dashboard/equipment-type-chart";
import {
  RecentEquipmentTable,
  RecentEquipmentTableSkeleton,
} from "@/components/dashboard/recent-equipment-table";
import { LoadingState } from "@/components/ui/loading-spinner";
import { BarChart3 } from "lucide-react";

interface DepartmentDashboardProps {
  departmentId: string;
}

export function DepartmentDashboard({
  departmentId,
}: DepartmentDashboardProps) {
  // For now, we'll use mock data since we don't have department-specific stats yet
  // In a real implementation, you would fetch department-specific stats
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-[#2678E7]" />
        <h2 className="text-xl font-semibold text-gray-900">
          Overview of Equipment Inventory and Statistics
        </h2>
      </div>

      <LoadingState
        isLoading={isLoading}
        error={error}
        loadingText="Loading department statistics..."
        errorText="Failed to load department statistics"
        onRetry={() => refetch()}
      >
        {stats ? (
          <>
            <StatsOverview stats={stats} />
            <div className="grid gap-6 lg:grid-cols-2">
              <EquipmentStatusChart stats={stats} />
              <EquipmentTypeChart stats={stats} />
            </div>
            <RecentEquipmentTable equipment={stats.recentEquipment} />
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No statistics available</p>
            <p className="text-sm text-gray-400">
              Statistics will be displayed once equipment data is available
            </p>
          </div>
        )}
      </LoadingState>
    </div>
  );
}
