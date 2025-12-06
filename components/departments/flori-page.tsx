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

const landData = [
  { name: "Total Area", value: 50 },
  { name: "Cultivated", value: 35 },
  { name: "Research Plots", value: 10 },
  { name: "Infrastructure", value: 5 },
];

const hrData = [
  { name: "Officers", value: 8, color: "hsl(142, 45%, 35%)" },
  { name: "Officials", value: 12, color: "hsl(45, 85%, 55%)" },
  { name: "Support Staff", value: 15, color: "hsl(25, 80%, 50%)" },
];

const COLORS = ["hsl(142, 45%, 35%)", "hsl(45, 85%, 55%)", "hsl(25, 80%, 50%)", "hsl(180, 40%, 40%)"];

const farmMachinery = [
  { equipment: "Tractor", quantity: 3 },
  { equipment: "Rotavator", quantity: 2 },
  { equipment: "Spray Pump", quantity: 5 },
  { equipment: "Water Pump", quantity: 4 },
];

const labEquipment = [
  { equipment: "Microscope", quantity: 4 },
  { equipment: "pH Meter", quantity: 3 },
  { equipment: "Weighing Balance", quantity: 5 },
  { equipment: "Incubator", quantity: 2 },
];

const hrDetailed = [
  { post: "Director", bps: 20, sanctioned: 1, inPosition: 1, vacant: 0 },
  { post: "Research Officer", bps: 18, sanctioned: 3, inPosition: 2, vacant: 1 },
  { post: "Assistant Research Officer", bps: 17, sanctioned: 4, inPosition: 3, vacant: 1 },
  { post: "Field Assistant", bps: 11, sanctioned: 8, inPosition: 6, vacant: 2 },
  { post: "Lab Attendant", bps: 5, sanctioned: 6, inPosition: 5, vacant: 1 },
];

const totalHR = hrDetailed.reduce((acc, row) => ({
  sanctioned: acc.sanctioned + row.sanctioned,
  inPosition: acc.inPosition + row.inPosition,
  vacant: acc.vacant + row.vacant,
}), { sanctioned: 0, inPosition: 0, vacant: 0 });

export function FloriPage() {
  return (
    <DepartmentLayout
      name="Floriculture Research Institute"
      description="Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development."
      image="/images/flori.jpg.jpg"
      focalPerson={{
        name: "Dr. Muhammad Akram",
        designation: "Research Officer",
        phone: "+92-61-9210073",
        email: "akram@flori.gov.pk",
      }}
    >
      {/* Land Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Area</div>
          <div className="text-2xl font-bold text-primary">50 Acres</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Cultivated</div>
          <div className="text-2xl font-bold text-green-600">35 Acres</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Research Plots</div>
          <div className="text-2xl font-bold text-secondary">10 Acres</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Infrastructure</div>
          <div className="text-2xl font-bold text-muted-foreground">5 Acres</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Land Resources Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={landData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {landData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Human Resources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hrData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(142, 45%, 35%)">
                {hrData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Equipment Tables */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Farm Machinery</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Equipment</th>
                <th className="text-right py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {farmMachinery.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.equipment}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lab Equipment</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Equipment</th>
                <th className="text-right py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {labEquipment.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.equipment}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* HR Detailed Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Human Resources Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Sr.#</th>
                <th className="text-left py-3 px-2">Name of Post</th>
                <th className="text-center py-3 px-2">BPS</th>
                <th className="text-center py-3 px-2">Sanctioned</th>
                <th className="text-center py-3 px-2">In Position</th>
                <th className="text-center py-3 px-2">Vacant</th>
              </tr>
            </thead>
            <tbody>
              {hrDetailed.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">{row.post}</td>
                  <td className="text-center py-3 px-2">{row.bps}</td>
                  <td className="text-center py-3 px-2">{row.sanctioned}</td>
                  <td className="text-center py-3 px-2">{row.inPosition}</td>
                  <td className="text-center py-3 px-2">{row.vacant}</td>
                </tr>
              ))}
              <tr className="border-t-2 font-bold bg-muted/50">
                <td colSpan={3} className="py-3 px-2">Total</td>
                <td className="text-center py-3 px-2">{totalHR.sanctioned}</td>
                <td className="text-center py-3 px-2">{totalHR.inPosition}</td>
                <td className="text-center py-3 px-2">{totalHR.vacant}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </DepartmentLayout>
  );
}
