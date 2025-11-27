"use client";

import { useAllDepartmentsStats } from "@/hooks/use-dashboard";
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

export default function OverviewPage() {
  const { data: stats, isLoading, error, refetch } = useAllDepartmentsStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Organization Overview
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Overview of equipment inventory and statistics across all
            departments
          </p>
        </div>
        <a
          href="/dashboard/all-equipment"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#2678E7] text-white hover:bg-[#1e5bb8] hover:scale-105 hover:shadow-lg h-10 px-4 py-2 w-full sm:w-auto shadow-sm"
        >
          View All Equipment
        </a>
      </div>

      <LoadingState
        isLoading={isLoading}
        error={error}
        loadingText="Loading organization overview..."
        errorText="Failed to load overview"
        onRetry={() => refetch()}
      >
        {stats && (
          <>
            <StatsOverview stats={stats} />
            <div className="grid gap-6 lg:grid-cols-2">
              <EquipmentStatusChart stats={stats} />
              <EquipmentTypeChart stats={stats} />
            </div>
            <RecentEquipmentTable equipment={stats.recentEquipment} />
          </>
        )}
      </LoadingState>
    </div>
  );
}
