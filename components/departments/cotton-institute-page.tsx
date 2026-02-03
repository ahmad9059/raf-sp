"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FlaskConical, Tractor, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CRIAsset {
  id: string;
  name: string;
  type: string;
  makeModel: string | null;
  labDepartment: string | null;
  year: string | null;
  location: string | null;
  quantity: number;
  purposeFunction: string | null;
  operationalStatus: string | null;
  description: string | null;
  imageUrl: string | null;
}

interface CRIData {
  department: {
    id: string;
    name: string;
    location: string;
    description: string;
    focalPerson: string;
    designation: string;
    phone: string;
    email: string;
  };
  labEquipment: CRIAsset[];
  farmMachinery: CRIAsset[];
  landData: CRIAsset[];
  buildingData: CRIAsset[];
  hrData: CRIAsset[];
  statistics: {
    totalLabEquipment: number;
    functionalLab: number;
    nonFunctionalLab: number;
    totalFarmMachinery: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const palette = ["#0ea5e9", "#6366f1", "#f97316", "#10b981", "#ec4899", "#22c55e", "#f59e0b"];

const toNumber = (value?: string | number | null) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function CottonInstitutePage() {
  const [data, setData] = useState<CRIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/cri")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching CRI data:", error);
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Cotton Research Institute"
        description="Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry."
        image="/images/cotton.jpg.png"
        focalPerson={{
          name: "Loading...",
          designation: "Loading...",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-8">
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
        name="Cotton Research Institute"
        description="Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry."
        image="/images/cotton.jpg.png"
        focalPerson={{
          name: "Dr. Muhammad Tauseef",
          designation: "Senior Scientist (Agronomy)",
          phone: "+923340072357",
          email: "dircrimm@gmail.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">No data available. Please contact the administrator.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  const totalPositions = data.hrData.reduce((acc, item) => acc + toNumber(item.description), 0);

  return (
    <DepartmentLayout
      name={data.department.name}
      description={
        data.department.description ||
        "Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry."
      }
      image="/images/cotton.jpg.png"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Muhammad Tauseef",
        designation: data.department.designation || "Senior Scientist (Agronomy)",
        phone: data.department.phone || "+923340072357",
        email: data.department.email || "dircrimm@gmail.com",
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
        {/* Snapshot */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="p-6 shadow-sm border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Positions</p>
                  <div className="text-4xl font-bold text-slate-900">{totalPositions}</div>
                  <p className="text-sm text-slate-600 mt-1">Across all HR roles</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Users className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </Card>
          </motion.div>
          {[
            { label: "Total Lab Equipment", value: data.statistics.totalLabEquipment },
            { label: "Functional Lab", value: data.statistics.functionalLab },
            { label: "Non-Functional Lab", value: data.statistics.nonFunctionalLab },
            { label: "Farm Machinery", value: data.statistics.totalFarmMachinery },
          ].map((item) => (
            <motion.div key={item.label} variants={itemVariants}>
              <Card className="p-4 shadow-sm border-slate-200 bg-white h-full">
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{item.label}</div>
                <div className="text-2xl font-semibold text-slate-900">{item.value}</div>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Land & Infrastructure */}
        <section className="space-y-6">
          <motion.div className="flex items-center gap-3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Land & Infrastructure</h2>
              <p className="text-sm text-slate-500">Area footprint and on-ground facilities</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.landData?.map((item) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
                <Card className="p-5 h-full border-slate-200 shadow-sm bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-slate-500">{item.name}</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{item.description}</div>
                    </div>
                    <MapPin className="w-5 h-5 text-slate-500" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.buildingData?.map((item) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
                <Card className="p-5 h-full border-slate-200 shadow-sm bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">{item.name}</div>
                      <div className="text-2xl font-semibold text-slate-900 mt-1">{item.description}</div>
                    </div>
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Resources */}
        <section className="space-y-6">
          <motion.div className="flex items-center gap-3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Human Resources</h2>
              <p className="text-sm text-slate-500">Staffing snapshot and distribution</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.hrData?.map((item, idx) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -4 }}>
                <Card className="p-5 h-full bg-white shadow-sm border border-slate-200">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Positions</div>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-slate-900">{toNumber(item.description)}</div>
                    <div className="w-10 h-10 rounded-full" style={{ backgroundColor: palette[idx % palette.length], opacity: 0.2 }} aria-hidden />
                  </div>
                  <div className="text-sm text-slate-700 mt-1">{item.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" /> Distribution by Role
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={
                    data.hrData?.map((item, idx) => ({
                      name: item.name,
                      value: toNumber(item.description),
                      fill: palette[idx % palette.length],
                    })) || []
                  }
                  margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} angle={-12} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {(data.hrData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </section>

        {/* Laboratory Equipment */}
        <section className="space-y-6">
          <motion.div className="flex items-center gap-3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Laboratory Equipment</h2>
              <p className="text-sm text-slate-500">Operational readiness across labs</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <Card className="p-6 border-slate-200 shadow-sm bg-white w-full">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-slate-600" /> Status
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Functional", value: data.statistics.functionalLab, color: "#10b981" },
                        { name: "Non-Functional", value: data.statistics.nonFunctionalLab, color: "#ef4444" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Functional", value: data.statistics.functionalLab, color: "#10b981" },
                        { name: "Non-Functional", value: data.statistics.nonFunctionalLab, color: "#ef4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 shadow-sm overflow-hidden bg-white w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-slate-600" /> Equipment List
                </h3>
                <span className="text-xs text-slate-500">{data.labEquipment.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Equipment</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Department</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.labEquipment.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-slate-600">{item.labDepartment}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              item.operationalStatus === "Functional"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                            }
                          >
                            {item.operationalStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Farm Machinery */}
        <section className="space-y-6">
          <motion.div className="flex items-center gap-3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Farm Machinery</h2>
              <p className="text-sm text-slate-500">Operational field assets</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <Card className="p-6 border-slate-200 shadow-sm bg-white w-full">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-slate-600" /> Status
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        data.farmMachinery.reduce((acc, item) => {
                          const key = item.operationalStatus || "Unknown";
                          acc[key] = (acc[key] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([name, value], idx) => ({
                        name,
                        value,
                        color: palette[idx % palette.length],
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(
                        data.farmMachinery.reduce((acc, item) => {
                          const key = item.operationalStatus || "Unknown";
                          acc[key] = (acc[key] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([, __], index) => (
                        <Cell key={`farm-cell-${index}`} fill={palette[index % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 shadow-sm overflow-hidden bg-white w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tractor className="w-4 h-4 text-slate-600" /> Machinery List
                </h3>
                <span className="text-xs text-slate-500">{data.farmMachinery.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Machinery</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Year</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Location</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.farmMachinery.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{item.year || "-"}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              item.operationalStatus === "Functional"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }
                          >
                            {item.operationalStatus || "N/A"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Contact Information */}
        <motion.section variants={itemVariants}>
          <Card className="p-8 bg-white text-slate-900 shadow-sm border-slate-200">
            <h3 className="text-xl font-semibold mb-4">Institute Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <Building2 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Address</div>
                  <div className="font-medium">{data.department.location || "Old Shujabad Road Multan"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Focal Person</div>
                  <div className="font-medium">{data.department.focalPerson}</div>
                  <div className="text-sm text-slate-500">{data.department.designation}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <Phone className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Phone</div>
                  <div className="font-medium">{data.department.phone || "+92-61-9200337"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <Mail className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <div className="font-medium">{data.department.email || "dircrimm@gmail.com"}</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
