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

const budgetDistribution = [
  { name: "Equipment", value: 45 },
  { name: "Operations", value: 30 },
  { name: "Staff", value: 20 },
  { name: "Maintenance", value: 5 },
];

const yearlyAllocation = [
  { year: "2025-26", amount: 15, color: "hsl(142, 45%, 35%)" },
  { year: "2026-27", amount: 18, color: "hsl(45, 85%, 55%)" },
  { year: "2027-28", amount: 20, color: "hsl(25, 80%, 50%)" },
  { year: "2028-29", amount: 22, color: "hsl(180, 40%, 40%)" },
];

const staffDistribution = [
  { name: "Officers", value: 8 },
  { name: "Lab Technicians", value: 12 },
  { name: "Support Staff", value: 10 },
];

const equipmentSummary = [
  { name: "Analytical", value: 25, color: "hsl(142, 45%, 35%)" },
  { name: "Testing", value: 18, color: "hsl(45, 85%, 55%)" },
  { name: "Sampling", value: 15, color: "hsl(25, 80%, 50%)" },
];

const COLORS = ["hsl(142, 45%, 35%)", "hsl(45, 85%, 55%)", "hsl(25, 80%, 50%)", "hsl(180, 40%, 40%)"];

const budgetDetails = [
  { code: "A01", particulars: "Lab Equipment", y2025: 5.5, y2026: 6.0, y2027: 6.5, y2028: 7.0 },
  { code: "A02", particulars: "Chemicals & Reagents", y2025: 3.2, y2026: 3.5, y2027: 3.8, y2028: 4.0 },
  { code: "A03", particulars: "Staff Salaries", y2025: 4.0, y2026: 4.5, y2027: 5.0, y2028: 5.5 },
  { code: "A04", particulars: "Utilities", y2025: 1.5, y2026: 1.8, y2027: 2.0, y2028: 2.2 },
  { code: "A05", particulars: "Maintenance", y2025: 0.8, y2026: 1.0, y2027: 1.2, y2028: 1.5 },
];

const officers = [
  { name: "Dr. Muhammad Tariq", designation: "Lab Director", qualification: "PhD Soil Science" },
  { name: "Dr. Ayesha Khan", designation: "Senior Chemist", qualification: "PhD Chemistry" },
  { name: "Engr. Ali Hassan", designation: "Water Quality Expert", qualification: "MSc Environmental Eng" },
];

const outcomes = [
  "Soil fertility assessment for 5000+ farmers annually",
  "Water quality testing for irrigation sources",
  "Fertilizer recommendations based on soil analysis",
  "Training programs for extension workers",
];

export function SoilWaterPage() {
  return (
    <DepartmentLayout
      name="Soil & Water Testing Laboratory"
      description="Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region."
      image="/images/soil.png.jpg"
      focalPerson={{
        name: "Dr. Muhammad Tariq",
        designation: "Lab Director",
        phone: "+92-61-9210074",
        email: "tariq@soilwater.gov.pk",
      }}
    >
      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Yearly Allocation (Million PKR)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyAllocation}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}M PKR`} />
              <Bar dataKey="amount" fill="hsl(142, 45%, 35%)">
                {yearlyAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Staff Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={staffDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {staffDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Equipment Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equipmentSummary}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(142, 45%, 35%)">
                {equipmentSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Budget Details Table */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Detailed Budget Breakdown (Million PKR)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Code</th>
                <th className="text-left py-3 px-2">Particulars</th>
                <th className="text-right py-3 px-2">2025-26</th>
                <th className="text-right py-3 px-2">2026-27</th>
                <th className="text-right py-3 px-2">2027-28</th>
                <th className="text-right py-3 px-2">2028-29</th>
                <th className="text-right py-3 px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {budgetDetails.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{row.code}</td>
                  <td className="py-3 px-2">{row.particulars}</td>
                  <td className="text-right py-3 px-2">{row.y2025}</td>
                  <td className="text-right py-3 px-2">{row.y2026}</td>
                  <td className="text-right py-3 px-2">{row.y2027}</td>
                  <td className="text-right py-3 px-2">{row.y2028}</td>
                  <td className="text-right py-3 px-2 font-semibold">
                    {(row.y2025 + row.y2026 + row.y2027 + row.y2028).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Officers List */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Key Officers</h3>
        <div className="space-y-4">
          {officers.map((officer, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-semibold">{officer.name}</div>
                <div className="text-sm text-muted-foreground">{officer.designation}</div>
              </div>
              <div className="text-sm text-muted-foreground">{officer.qualification}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Project Outcomes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Outcomes</h3>
        <ul className="space-y-2">
          {outcomes.map((outcome, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </Card>
    </DepartmentLayout>
  );
}
