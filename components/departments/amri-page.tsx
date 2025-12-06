"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
);
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), {
  ssr: false,
});
const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});

const COLORS = ["hsl(142, 45%, 35%)", "hsl(0, 70%, 50%)"];

const statusData = [
  { name: "Functional", value: 45 },
  { name: "Non-Functional", value: 12 },
];

const topMachinery = [
  { name: "Tractors", qty: 15, color: "hsl(142, 45%, 35%)" },
  { name: "Harvesters", qty: 8, color: "hsl(45, 85%, 55%)" },
  { name: "Planters", qty: 12, color: "hsl(25, 80%, 50%)" },
  { name: "Sprayers", qty: 10, color: "hsl(180, 40%, 40%)" },
];

const machineryList = [
  { name: "Tractor (75 HP)", quantity: 8, status: "Functional" },
  { name: "Tractor (50 HP)", quantity: 7, status: "Functional" },
  { name: "Combine Harvester", quantity: 3, status: "Functional" },
  { name: "Seed Drill", quantity: 6, status: "Functional" },
  { name: "Rotavator", quantity: 5, status: "Functional" },
  { name: "Disc Harrow", quantity: 4, status: "Non-Functional" },
  { name: "Cultivator", quantity: 8, status: "Functional" },
  { name: "Spray Pump", quantity: 10, status: "Functional" },
  { name: "Thresher", quantity: 3, status: "Non-Functional" },
];

export function AMRIPage() {
  return (
    <DepartmentLayout
      name="Agricultural Mechanization Research Institute"
      description="Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions."
      image="/images/amri.jpg.jpeg"
      focalPerson={{
        name: "Dr. Khalid Mahmood",
        designation: "Director",
        phone: "+92-61-9210072",
        email: "khalid.mahmood@amri.gov.pk",
      }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Total Machinery
          </div>
          <div className="text-3xl font-bold text-primary">57</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Functional</div>
          <div className="text-3xl font-bold text-green-600">45</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Non-Functional
          </div>
          <div className="text-3xl font-bold text-red-600">12</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Machinery Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Machinery Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMachinery}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="hsl(142, 45%, 35%)">
                {topMachinery.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Machinery Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Machinery Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Machinery Name</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {machineryList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        item.status === "Functional"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DepartmentLayout>
  );
}
