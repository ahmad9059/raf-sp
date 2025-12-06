"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });

const hrStatus = [
  { name: "Filled", value: 28 },
  { name: "Vacant", value: 7 },
];

const landDistribution = [
  { name: "Office", value: 5, color: "hsl(142, 45%, 35%)" },
  { name: "Buildings", value: 10, color: "hsl(45, 85%, 55%)" },
  { name: "Cultivated", value: 120, color: "hsl(25, 80%, 50%)" },
];

const COLORS = ["hsl(142, 45%, 35%)", "hsl(0, 70%, 50%)"];

const landResources = [
  { resource: "Total Area", value: "135 Acres" },
  { resource: "Cultivated Land", value: "120 Acres" },
  { resource: "Buildings", value: "10 Acres" },
  { resource: "Office Area", value: "5 Acres" },
];

const buildings = [
  { name: "Admin Block", area: "2000 sq ft", status: "Good" },
  { name: "Research Lab", area: "1500 sq ft", status: "Good" },
  { name: "Storage Facility", area: "1000 sq ft", status: "Fair" },
];

const farmMachinery = [
  { equipment: "Tractor", qty: 4 },
  { equipment: "Spray Pump", qty: 8 },
  { equipment: "Pruning Tools", qty: 25 },
  { equipment: "Harvesting Equipment", qty: 12 },
];

export function MRIPage() {
  return (
    <DepartmentLayout
      name="Mango Research Institute"
      description="Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement."
      image="/images/mango.jpg.jpg"
      focalPerson={{
        name: "Dr. Muhammad Tauseef",
        designation: "Senior Scientist (Agronomy)",
        phone: "+923340072357",
        email: "tauseef@mri.gov.pk",
      }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Posts</div>
          <div className="text-3xl font-bold text-primary">35</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Filled</div>
          <div className="text-3xl font-bold text-green-600">28</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Vacant</div>
          <div className="text-3xl font-bold text-red-600">7</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">HR Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hrStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {hrStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Land Distribution (Acres)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={landDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(142, 45%, 35%)">
                {landDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Land Resources */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Land Resources Summary</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {landResources.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">{item.resource}</span>
              <span className="text-primary font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Buildings */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Building Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Building Name</th>
                <th className="text-left py-3 px-2">Area</th>
                <th className="text-left py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{building.name}</td>
                  <td className="py-3 px-2">{building.area}</td>
                  <td className="py-3 px-2">{building.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Farm Machinery */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Farm Machinery</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {farmMachinery.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">{item.equipment}</span>
              <span className="text-primary font-semibold">{item.qty}</span>
            </div>
          ))}
        </div>
      </Card>
    </DepartmentLayout>
  );
}
