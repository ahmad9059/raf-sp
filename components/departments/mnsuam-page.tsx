"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, BarChart3, Users, Leaf, Thermometer, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Facility {
  id: string;
  name: string;
  blockName: string | null;
  facilityType: string | null;
  capacityPersons: number | null;
  imageUrl: string | null;
  type: string;
}

interface AgronomyEquipment {
  id: string;
  name: string;
  type: string;
  quantity: number | null;
  focalPerson1: string | null;
}

interface BlockSummary {
  blockName: string;
  rooms: number;
  capacity: number;
}

interface EquipmentTypeStat {
  type: string;
  count: number;
}

interface MNSUAMData {
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
  facilities: Facility[];
  agronomyEquipment: AgronomyEquipment[];
  stats: {
    totalFacilities: number;
    totalCapacity: number;
    blockSummary: BlockSummary[];
    equipmentSummary: {
      totalTypes: number;
      totalUnits: number;
      equipmentByType: EquipmentTypeStat[];
    };
  };
  focalPersons: { name: string; role: string; email: string }[];
  notes: string;
}

const piePalette = ["#22c55e", "#0ea5e9", "#f97316", "#8b5cf6", "#eab308", "#ef4444"];

export function MNSUAMPage() {
  const [data, setData] = useState<MNSUAMData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/mnsuam")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MNSUAM data:", error);
        setLoading(false);
      });
  }, []);

  const facilityDistribution = useMemo(() => {
    if (!data) return [];
    return data.stats.blockSummary.map((block, idx) => ({
      ...block,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  const equipmentDistribution = useMemo(() => {
    if (!data) return [];
    return data.stats.equipmentSummary.equipmentByType.map((item, idx) => ({
      ...item,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  if (loading) {
    return (
      <DepartmentLayout
        name="MNS University of Agriculture"
        description="Vibrant agricultural university offering collaborative facilities and research-grade equipment."
        image="/images/mns.png.jpg"
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
        name="MNS University of Agriculture"
        description="Vibrant agricultural university offering collaborative facilities and research-grade equipment."
        image="/images/mns.png.jpg"
        focalPerson={{
          name: "Dr. Mahmood Alam",
          designation: "Directorate of University Farms",
          phone: "+92-61-9210071",
          email: "mahmood.alam@mnsuam.edu.pk",
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
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum."
      }
      image="/images/mns.png.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Mahmood Alam",
        designation: data.department.designation || "Directorate of University Farms",
        phone: data.department.phone || "+92-61-9210071",
        email: data.department.email || "mahmood.alam@mnsuam.edu.pk",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-md">
              <div className="flex items-center gap-3 mb-2 text-emerald-700 font-semibold">
                <Building2 className="w-5 h-5" />
                Estate Facilities
              </div>
              <div className="text-4xl font-black text-emerald-700">{data.stats.totalFacilities}</div>
              <p className="text-sm text-emerald-800/70 mt-1">spaces ready for meetings & training</p>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-100 border-blue-200 shadow-md">
              <div className="flex items-center gap-3 mb-2 text-sky-700 font-semibold">
                <Users className="w-5 h-5" />
                Total Capacity
              </div>
              <div className="text-4xl font-black text-sky-700">{data.stats.totalCapacity}</div>
              <p className="text-sm text-sky-800/70 mt-1">people can be hosted with backup power</p>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200 shadow-md">
              <div className="flex items-center gap-3 mb-2 text-amber-700 font-semibold">
                <Leaf className="w-5 h-5" />
                Agronomy Toolkit
              </div>
              <div className="text-4xl font-black text-amber-700">
                {data.stats.equipmentSummary.totalUnits}
              </div>
              <p className="text-sm text-amber-800/70 mt-1">
                units across {data.stats.equipmentSummary.totalTypes} specialized instruments
              </p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">Capacity by Block</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={facilityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="blockName" tick={{ fill: "#065f46", fontSize: 12 }} angle={-10} height={70} />
                <YAxis tick={{ fill: "#065f46" }} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#34d399" }} />
                <Legend />
                <Bar dataKey="capacity" radius={[10, 10, 0, 0]} fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-sky-50 border-sky-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-bold text-sky-900">Equipment Mix</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={equipmentDistribution}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {equipmentDistribution.map((item, idx) => (
                    <Cell key={item.type} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#38bdf8" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h3 className="text-2xl font-bold text-violet-900">All-Weather Estate Facilities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.facilities.map((facility, idx) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="p-5 h-full border-violet-100 bg-gradient-to-b from-white to-violet-50 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-violet-600 font-semibold">
                        {facility.blockName}
                      </p>
                      <h4 className="text-lg font-bold text-gray-900 mt-1">{facility.name}</h4>
                      <p className="text-sm text-gray-500">
                        {facility.facilityType} • {facility.capacityPersons || "N/A"} capacity
                      </p>
                    </div>
                    <div className="text-3xl">{facility.imageUrl || "🏢"}</div>
                  </div>
                  <Badge className="mt-4 bg-violet-600 hover:bg-violet-700">
                    {facility.type}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
          <Card className="p-4 bg-violet-900 text-white border-none shadow-xl">
            <p className="text-sm">{data.notes}</p>
          </Card>
        </motion.section>

        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h3 className="text-2xl font-bold text-emerald-900">Agronomy Equipment Readiness</h3>
          </div>
          <Card className="overflow-hidden border-emerald-100 shadow-lg">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">Equipment Inventory</p>
                <p className="text-2xl font-bold">Precision tools powering crop science</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total units</p>
                <p className="text-3xl font-black">{data.stats.equipmentSummary.totalUnits}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-900">
                    <th className="py-3 px-4 text-left text-sm font-semibold">Equipment</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Type</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Quantity</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Focal Person</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {data.agronomyEquipment.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/70 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.type}</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.focalPerson1 || data.focalPersons[1]?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {data.focalPersons.map((person, idx) => (
            <Card
              key={person.email}
              className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg"
            >
              <p className="text-xs uppercase tracking-wide text-slate-300">Focal Person</p>
              <h4 className="text-xl font-bold mt-1">{person.name}</h4>
              <p className="text-slate-200">{person.role}</p>
              <div className="mt-3 text-sm text-slate-300">{person.email}</div>
              <Badge className="mt-4 bg-white/10 text-white border border-white/20">
                {idx === 0 ? "University Farms" : "Agronomy Department"}
              </Badge>
            </Card>
          ))}
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
