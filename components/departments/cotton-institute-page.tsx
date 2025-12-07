"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FlaskConical, Tractor, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export function CottonInstitutePage() {
  const [data, setData] = useState<CRIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/cri")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching CRI data:", error);
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

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry."}
      image="/images/cotton.jpg.png"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Muhammad Tauseef",
        designation: data.department.designation || "Senior Scientist (Agronomy)",
        phone: data.department.phone || "+923340072357",
        email: data.department.email || "dircrimm@gmail.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Land & Infrastructure Assets */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              Land & Infrastructure Assets
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.landData?.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <Card className="p-6 text-center h-full border-emerald-100 bg-gradient-to-b from-white to-emerald-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">
                    {item.imageUrl}
                  </div>
                  <div className="text-4xl font-extrabold text-emerald-600 mb-2 tracking-tight">{item.description}</div>
                  <div className="text-sm font-medium text-emerald-800/70 uppercase tracking-wide">{item.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            {data.buildingData?.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 text-center border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl">{item.imageUrl}</span>
                    <div className="text-left">
                      <div className="text-4xl font-bold text-teal-700">{item.description}</div>
                      <div className="text-sm font-medium text-teal-600">{item.name}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Resource Assets */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Human Resource Assets
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {data.hrData?.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className={`p-6 text-center h-full text-white bg-gradient-to-br ${item.imageUrl} shadow-lg hover:shadow-2xl transition-all duration-300 border-none`}>
                  <div className="text-5xl font-black mb-2 drop-shadow-md">{item.description}</div>
                  <div className="text-sm font-medium text-white/90">{item.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Human Resources Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Human Resource Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.hrData?.map((item, idx) => ({
                    name: item.name,
                    value: parseInt(item.description || '0'),
                    fill: ['#3b82f6', '#8b5cf6', '#d946ef', '#f97316'][idx]
                  })) || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#1e3a8a', fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#1e3a8a' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {(data.hrData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#d946ef', '#f97316'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </section>

        {/* Laboratory Equipment Analysis */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Laboratory Equipment Analysis
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg">
                <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Total Equipment</div>
                <div className="text-6xl font-black text-purple-600">{data.statistics.totalLabEquipment}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg">
                <div className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Functional Equipment</div>
                <div className="text-6xl font-black text-green-600">{data.statistics.functionalLab}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-red-50 border-red-100 shadow-lg">
                <div className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Non-Functional</div>
                <div className="text-6xl font-black text-red-600">{data.statistics.nonFunctionalLab}</div>
              </Card>
            </motion.div>
          </div>

          {/* Lab Equipment Status Pie Chart */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
              <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Equipment Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Functional', value: data.statistics.functionalLab, color: '#10b981' },
                      { name: 'Non-Functional', value: data.statistics.nonFunctionalLab, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Functional', value: data.statistics.functionalLab, color: '#10b981' },
                      { name: 'Non-Functional', value: data.statistics.nonFunctionalLab, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #a855f7',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" /> Key Equipment Status
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-50/50">
                      <th className="text-left py-4 px-6 font-bold text-purple-900">Equipment</th>
                      <th className="text-left py-4 px-6 font-bold text-purple-900">Department</th>
                      <th className="text-center py-4 px-6 font-bold text-purple-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {data.labEquipment.map((item, idx) => (
                      <motion.tr 
                        key={item.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-purple-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-gray-800">{item.name}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{item.labDepartment}</td>
                        <td className="py-4 px-6 text-center">
                          <Badge className={`px-3 py-1 ${item.operationalStatus === "Functional" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} shadow-sm`}>
                            {item.operationalStatus}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
              <div className="flex gap-4">
                <div className="p-2 bg-blue-100 rounded-full h-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Key Observation</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    The majority lab facilities are in non-functional state. Procurement of lab chemicals is under process. This data is provided to establish the South Punjab Regional Agriculture Forum.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Farm Machinery Analysis */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Farm Machinery Analysis
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="mb-8">
            <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-5">
                <Tractor className="w-64 h-64" />
              </div>
              <div className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Total Machinery</div>
              <div className="text-6xl font-black text-orange-600 mb-2">{data.statistics.totalFarmMachinery}</div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> All equipment functional
              </div>
            </Card>
          </motion.div>

          {/* Farm Machinery Pie Chart */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="mb-8">
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg">
              <h3 className="text-base font-bold text-orange-900 mb-4 flex items-center gap-2">
                <Tractor className="w-5 h-5" /> Equipment Distribution
              </h3>
              <ResponsiveContainer  width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Tractors', value: 2, color: '#f97316' },
                      { name: 'Cultivation Tools', value: 8, color: '#ea580c' },
                      { name: 'Harvesting Equipment', value: 6, color: '#dc2626' },
                      { name: 'Other Machinery', value: 6, color: '#fb923c' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Tractors', value: 2, color: '#f97316' },
                      { name: 'Cultivation Tools', value: 8, color: '#ea580c' },
                      { name: 'Harvesting Equipment', value: 6, color: '#dc2626' },
                      { name: 'Other Machinery', value: 6, color: '#fb923c' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #f97316',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-xl">
              <div className="bg-gradient-to-r from-blue-300 to-purple-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tractor className="w-5 h-5" /> Important Farm Machinery
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-orange-50/50">
                      <th className="text-left py-4 px-6 font-bold text-orange-900">Machinery</th>
                      <th className="text-center py-4 px-6 font-bold text-orange-900">Model/Year</th>
                      <th className="text-left py-4 px-6 font-bold text-orange-900">Location</th>
                      <th className="text-center py-4 px-6 font-bold text-orange-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {data.farmMachinery.map((item, idx) => (
                      <motion.tr 
                        key={item.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-orange-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-gray-800">{item.name}</td>
                        <td className="py-4 px-6 text-center text-sm font-mono text-gray-600">{item.year || "-"}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{item.location}</td>
                        <td className="py-4 px-6 text-center">
                          <Badge className="bg-green-500 hover:bg-green-600 shadow-sm">
                            {item.operationalStatus}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6">
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
              <div className="flex gap-4">
                <div className="p-2 bg-green-100 rounded-full h-fit">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 mb-1">Machinery Status</h4>
                  <p className="text-sm text-green-800 leading-relaxed">
                    The machinery lab facilities are in very good state. Procurement of lab chemicals is under process. This data is provided to establish the South Punjab Regional Agriculture Forum.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Contact Information */}
        <motion.section variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl border-none">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
              Institute Information
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Address</div>
                    <div className="font-medium">{data.department.location || "Old Shujabad Road Multan"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Focal Person</div>
                    <div className="font-medium">{data.department.focalPerson}</div>
                    <div className="text-sm text-slate-300">{data.department.designation}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Phone</div>
                    <div className="font-medium">{data.department.phone || "+92-61-9200337"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="font-medium">{data.department.email || "dircrimm@gmail.com"}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
