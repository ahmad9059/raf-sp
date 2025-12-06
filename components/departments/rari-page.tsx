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

const hrData = [
  { name: "Scientific Officers", value: 12 },
  { name: "Support Staff", value: 18 },
  { name: "Vacant Positions", value: 5 },
];

const researchFocus = [
  { name: "Crop Improvement", value: 85, color: "hsl(142, 45%, 35%)" },
  { name: "Plant Protection", value: 75, color: "hsl(45, 85%, 55%)" },
  { name: "Soil Management", value: 70, color: "hsl(25, 80%, 50%)" },
  { name: "Water Conservation", value: 65, color: "hsl(180, 40%, 40%)" },
];

const COLORS = ["hsl(142, 45%, 35%)", "hsl(45, 85%, 55%)", "hsl(0, 70%, 50%)"];

const outputs = [
  "Development of high-yielding crop varieties",
  "Integrated pest management strategies",
  "Soil fertility improvement techniques",
  "Water-efficient irrigation methods",
  "Climate-resilient farming practices",
];

const functions = [
  { title: "Research", desc: "Conducting adaptive research on crops" },
  { title: "Extension", desc: "Technology transfer to farmers" },
  { title: "Training", desc: "Capacity building programs" },
  { title: "Seed Production", desc: "Quality seed multiplication" },
];

const plantProtection = [
  { activity: "Pest Surveillance", frequency: "Weekly" },
  { activity: "Disease Monitoring", frequency: "Bi-weekly" },
  { activity: "IPM Demonstrations", frequency: "Monthly" },
  { activity: "Farmer Training", frequency: "Quarterly" },
];

export function RARIPage() {
  return (
    <DepartmentLayout
      name="Regional Agricultural Research Institute"
      description="Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region."
      image="/images/rai.jpg.jpg"
      focalPerson={{
        name: "Dr. Asif Ali",
        designation: "Research Officer",
        phone: "+92-61-9210073",
        email: "asif.ali@rari.gov.pk",
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Scientific Officers</div>
          <div className="text-3xl font-bold text-primary">12</div>
          <div className="text-sm text-amber-600 mt-2">5 positions vacant</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Staff</div>
          <div className="text-3xl font-bold text-primary">30</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Human Resources Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hrData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {hrData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Research Focus Areas (% Progress)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={researchFocus}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(142, 45%, 35%)">
                {researchFocus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Research Outputs */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Research Outputs</h3>
        <ul className="space-y-2">
          {outputs.map((output, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{output}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Functions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {functions.map((func, index) => (
          <Card key={index} className="p-4">
            <h4 className="font-semibold text-primary mb-2">{func.title}</h4>
            <p className="text-sm text-muted-foreground">{func.desc}</p>
          </Card>
        ))}
      </div>

      {/* Plant Protection Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Plant Protection Activities</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {plantProtection.map((activity, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">{activity.activity}</span>
              <span className="text-sm text-muted-foreground">{activity.frequency}</span>
            </div>
          ))}
        </div>
      </Card>
    </DepartmentLayout>
  );
}
