"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

const verificationStatus = [
  { name: "Verified", value: 145 },
  { name: "Unverified", value: 38 },
  { name: "Pending", value: 22 },
];

const COLORS = ["hsl(142, 45%, 35%)", "hsl(0, 70%, 50%)", "hsl(45, 85%, 55%)"];

const assetSample = [
  { name: "Microscopes", qty: 12, dateReceived: "2020-03-15", lastVerification: "2024-11-20" },
  { name: "Insect Collection Boxes", qty: 50, dateReceived: "2019-08-22", lastVerification: "2024-10-15" },
  { name: "Dissection Kits", qty: 25, dateReceived: "2021-01-10", lastVerification: "2024-11-18" },
  { name: "Specimen Jars", qty: 200, dateReceived: "2018-06-05", lastVerification: "2024-09-30" },
  { name: "Field Collection Nets", qty: 30, dateReceived: "2022-04-12", lastVerification: "2024-11-25" },
];

const itemTypeCounts = [
  { type: "Lab Equipment", count: 85 },
  { type: "Field Equipment", count: 45 },
  { type: "Specimens", count: 50 },
  { type: "Chemicals", count: 25 },
];

const infoGrid = [
  { label: "Scientific Officers", value: "5" },
  { label: "Support Officials", value: "8" },
  { label: "Total Land", value: "15 Acres" },
  { label: "Lab Rooms", value: "6" },
];

export function EntoPage() {
  return (
    <DepartmentLayout
      name="Entomological Research Sub Station"
      description="Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture."
      image="/images/ent.jpg.jpg"
      focalPerson={{
        name: "Dr. Sohail Ahmad",
        designation: "Senior Entomologist",
        phone: "+92-61-9210075",
        email: "sohail.ahmad@ento.gov.pk",
      }}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Assets</div>
          <div className="text-2xl font-bold text-primary">205</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Verified</div>
          <div className="text-2xl font-bold text-green-600">145</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Unverified</div>
          <div className="text-2xl font-bold text-red-600">38</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-600">22</div>
        </Card>
      </div>

      {/* Verification Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Asset Verification Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={verificationStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {verificationStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Asset Register Sample */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Asset Register (Sample)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-center py-3 px-2">Qty</th>
                <th className="text-left py-3 px-2">Date Received</th>
                <th className="text-left py-3 px-2">Last Verification</th>
              </tr>
            </thead>
            <tbody>
              {assetSample.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">{item.name}</td>
                  <td className="text-center py-3 px-2">{item.qty}</td>
                  <td className="py-3 px-2">{item.dateReceived}</td>
                  <td className="py-3 px-2">{item.lastVerification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Item Type Counts */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Equipment by Category</h3>
        <div className="space-y-3">
          {itemTypeCounts.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">{item.type}</span>
              <Badge variant="outline" className="text-lg">{item.count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoGrid.map((info, index) => (
          <Card key={index} className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
            <div className="text-xl font-bold text-primary">{info.value}</div>
          </Card>
        ))}
      </div>
    </DepartmentLayout>
  );
}
