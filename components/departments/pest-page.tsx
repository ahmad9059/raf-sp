"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentLayout } from "./department-layout";
import { FlaskConical, Building2, Users, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface FacilityRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  sectionCategory: string | null;
  quantityOrSanctioned: number | null;
  imageUrl: string | null;
}

interface HumanResource {
  name: string;
  bps: number | null;
  sanctioned: number;
  filled: number;
  vacant: number;
}

interface PesticideData {
  department: {
    id: string;
    name: string;
    location: string;
    description: string | null;
    focalPerson: string | null;
    designation: string | null;
    phone: string | null;
    email: string | null;
  };
  buildings: FacilityRecord[];
  instruments: FacilityRecord[];
  humanResources: HumanResource[];
  stats: {
    totalBuildings: number;
    totalInstruments: number;
    totalSanctioned: number;
    totalFilled: number;
    totalVacant: number;
    equipmentDistribution: { name: string; count: number }[];
  };
  notes: string;
  focalPersonDetail: {
    name: string;
    designation: string;
    contact: string;
    email: string;
  };
}

const palette = ["#22c55e", "#0ea5e9", "#8b5cf6", "#f97316", "#ef4444", "#a855f7"];

export function PestPage() {
  const [data, setData] = useState<PesticideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/pest")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pesticide QC lab data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Pesticide Quality Control Laboratory"
        description="Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals."
        image="/images/lab.jpg"
        focalPerson={{
          name: "Loading...",
          designation: "Loading...",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DepartmentLayout>
    );
  }

  if (!data) {
    return (
      <DepartmentLayout
        name="Pesticide Quality Control Laboratory"
        description="Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals."
        image="/images/lab.jpg"
        focalPerson={{
          name: "Dr Subhan Danish",
          designation: "Senior Scientist",
          phone: "0304-7996951",
          email: "sd96850@gmail.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">No data available. Please try again later.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout
      name={data.department.name}
      description={
        data.department.description ||
        "Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals."
      }
      image="/images/lab.jpg"
      focalPerson={{
        name: data.focalPersonDetail.name,
        designation: data.focalPersonDetail.designation,
        phone: data.focalPersonDetail.contact,
        email: data.focalPersonDetail.email,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-5 bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-md">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                <FlaskConical className="w-5 h-5" /> Instruments
              </div>
              <div className="text-4xl font-black text-emerald-700">{data.stats.totalInstruments}</div>
              <p className="text-sm text-emerald-800/70">lab-grade measurements</p>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-5 bg-gradient-to-br from-sky-50 to-blue-100 border-blue-200 shadow-md">
              <div className="flex items-center gap-2 text-sky-700 font-semibold mb-1">
                <Building2 className="w-5 h-5" /> Labs & Rooms
              </div>
              <div className="text-4xl font-black text-sky-700">{data.stats.totalBuildings}</div>
              <p className="text-sm text-sky-800/70">specialized spaces</p>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-100 border-indigo-200 shadow-md">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-1">
                <Users className="w-5 h-5" /> HR Filled
              </div>
              <div className="text-4xl font-black text-indigo-700">{data.stats.totalFilled}</div>
              <p className="text-sm text-indigo-800/70">scientists & staff</p>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 shadow-md">
              <div className="flex items-center gap-2 text-amber-700 font-semibold mb-1">
                <Activity className="w-5 h-5" /> Vacant Posts
              </div>
              <div className="text-4xl font-black text-amber-700">{data.stats.totalVacant}</div>
              <p className="text-sm text-amber-800/70">ready to be staffed</p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-gradient-to-br from-white to-sky-50 border-sky-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-bold text-sky-900">Precision Lab Footprint</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.buildings.map((b, idx) => (
                <Card
                  key={b.id}
                  className="p-4 border-sky-100 bg-white/80 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-sky-500 font-semibold">
                        {b.sectionCategory}
                      </p>
                      <h4 className="text-base font-bold text-slate-900">{b.name}</h4>
                    </div>
                    <div className="text-2xl">{b.imageUrl || "🏢"}</div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-4 p-3 bg-sky-900 text-white border-none shadow-md">
              <p className="text-sm">{data.notes}</p>
            </Card>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">Instrument Mix</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.stats.equipmentDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.stats.equipmentDistribution.map((entry, idx) => (
                    <Cell key={entry.name} fill={palette[idx % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {data.instruments.map((i) => (
                <Card key={i.id} className="p-3 border-emerald-100 bg-white shadow-sm">
                  <p className="text-xs uppercase text-emerald-600 font-semibold">{i.name}</p>
                  <p className="text-xl font-bold text-emerald-800">{i.quantityOrSanctioned}</p>
                </Card>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.section
          variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-2xl font-bold text-purple-900">Human Resource Snapshot</h3>
          </div>
          <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={data.humanResources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b21a8", fontSize: 11 }}
                  angle={-10}
                  height={70}
                />
                <YAxis tick={{ fill: "#6b21a8" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sanctioned" stackId="hr" fill="#a855f7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="filled" stackId="hr" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="vacant" stackId="hr" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="overflow-hidden border-purple-100 shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">Staffing Insight</p>
                <p className="text-xl font-bold">Sanctioned {data.stats.totalSanctioned} | Filled {data.stats.totalFilled} | Vacant {data.stats.totalVacant}</p>
              </div>
              <Badge className="bg-white/10 text-white border border-white/20">BPS Aligned</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50 text-purple-900">
                    <th className="py-3 px-4 text-left text-sm font-semibold">Post</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">BPS</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Sanctioned</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Filled</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Vacant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {data.humanResources.map((hr) => (
                    <tr key={hr.name} className="hover:bg-purple-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{hr.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{hr.bps ?? "-"}</td>
                      <td className="py-3 px-4 text-center font-semibold text-indigo-700">{hr.sanctioned}</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-700">{hr.filled}</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-700">{hr.vacant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
