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

export default function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Overview of your equipment inventory and statistics
          </p>
        </div>
        <a
          href="/dashboard/inventory"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#134866] text-white hover:bg-[#0f3a52] h-10 px-4 py-2 w-full sm:w-auto"
        >
          Manage Equipment
        </a>
      </div>

      <LoadingState
        isLoading={isLoading}
        error={error}
        loadingText="Loading dashboard data..."
        errorText="Failed to load dashboard"
        onRetry={() => refetch()}
      >
        {stats && (
          <>
            <StatsOverview stats={stats} />
            <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
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
