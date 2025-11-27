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

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your equipment inventory and statistics
          </p>
        </div>
        <a
          href="/dashboard/inventory"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#134866] text-white hover:bg-[#0f3a52] h-10 px-4 py-2"
        >
          Manage Equipment
        </a>
      </div>

      {isLoading ? (
        <>
          <StatsOverviewSkeleton />
          <div className="grid gap-6 md:grid-cols-2">
            <EquipmentStatusChartSkeleton />
            <EquipmentTypeChartSkeleton />
          </div>
          <RecentEquipmentTableSkeleton />
        </>
      ) : stats ? (
        <>
          <StatsOverview stats={stats} />
          <div className="grid gap-6 md:grid-cols-2">
            <EquipmentStatusChart stats={stats} />
            <EquipmentTypeChart stats={stats} />
          </div>
          <RecentEquipmentTable equipment={stats.recentEquipment} />
        </>
      ) : null}
    </div>
  );
}
