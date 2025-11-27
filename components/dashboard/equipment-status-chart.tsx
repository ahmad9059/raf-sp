"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DashboardStats } from "@/types";

interface EquipmentStatusChartProps {
  stats: DashboardStats;
}

const STATUS_COLORS = {
  Available: "#10b981", // green-500
  "In Use": "#f59e0b", // yellow-500
  "Needs Repair": "#f97316", // orange-500
  Discarded: "#ef4444", // red-500
};

export function EquipmentStatusChart({ stats }: EquipmentStatusChartProps) {
  const data = [
    { name: "Available", value: stats.availableCount },
    { name: "In Use", value: stats.inUseCount },
    { name: "Needs Repair", value: stats.needsRepairCount },
    { name: "Discarded", value: stats.discardedCount },
  ].filter((item) => item.value > 0); // Only show statuses with equipment

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No equipment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                window.innerWidth > 640
                  ? `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  : `${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={window.innerWidth > 640 ? 80 : 60}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EquipmentStatusChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
