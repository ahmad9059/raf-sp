"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FlaskConical, Users, Coins, Settings, Briefcase, UserCheck, Microscope, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SoilAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  bps: number | null;
  quantityRequired: number | null;
  budgetAllocationTotalMillion: number | null;
  justificationOrYear: string | null;
}

interface SoilData {
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
  budgetData: SoilAsset[];
  hrOfficers: SoilAsset[];
  hrOfficials: SoilAsset[];
  machinery: SoilAsset[];
  statistics: {
    totalBudget: number;
    totalHR: number;
    totalOfficers: number;
    totalOfficials: number;
    totalMachinery: number;
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

const HR_COLORS = ["#0ea5e9", "#38bdf8"]; // Sky Blue shades
const BUDGET_COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#075985"]; // Blue shades

export function SoilWaterPage() {
  const [data, setData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/soil-water")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Soil & Water data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Soil & Water Testing Laboratory"
        description="Loading..."
        image="/images/soil.png.jpg"
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
        name="Soil & Water Testing Laboratory"
        description="Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region."
        image="/images/soil.png.jpg"
        focalPerson={{
          name: "Ms. Fatima Bibi",
          designation: "Principal Scientist",
          phone: "061-4423568",
          email: "swt_mltn@yahoo.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">
            No data available. Please contact the administrator.
          </p>
        </Card>
      </DepartmentLayout>
    );
  }

  // Prepare HR Chart Data
  const hrChartData = [
    { name: "Officers", value: data.statistics.totalOfficers },
    { name: "Officials", value: data.statistics.totalOfficials },
  ];

  // Prepare Budget Chart Data
  const budgetChartData = data.budgetData.map(item => ({
    name: item.category || item.name.substring(0, 10),
    fullName: item.name,
    value: Number(item.budgetAllocationTotalMillion)
  }));

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region."}
      image="/images/soil.png.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Ms. Fatima Bibi",
        designation: data.department.designation || "Principal Scientist",
        phone: data.department.phone || "061-4423568",
        email: data.department.email || "swt_mltn@yahoo.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Total Budget
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalBudget} <span className="text-lg font-medium text-gray-500">M</span>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Total Staff
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalHR}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Machinery Items
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalMachinery}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Budget Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Budget Allocation (2025-2029)
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full border-cyan-200 shadow-lg">
                <h3 className="text-center text-gray-700 font-medium mb-6">Budget Distribution (Million PKR)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-cyan-200 shadow-lg rounded-lg">
                                <p className="font-bold text-cyan-800">{data.fullName}</p>
                                <p className="text-cyan-600">{data.value} Million</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {budgetChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-4">
                {data.budgetData.map((item, index) => (
                  <Card key={index} className="p-4 border-cyan-100 hover:shadow-md transition-all flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg text-cyan-600 font-bold text-xs">
                        {item.category}
                      </div>
                      <div className="font-medium text-gray-700">{item.name}</div>
                    </div>
                    <div className="text-lg font-bold text-cyan-700">
                      {item.budgetAllocationTotalMillion} M
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Human Resource Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
              Human Resources
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg bg-gradient-to-b from-white to-sky-50">
                <h3 className="text-center text-gray-700 font-medium mb-6">Staff Composition</h3>
                <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hrChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {hrChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={HR_COLORS[index % HR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">{data.statistics.totalHR}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                    <span>Officers ({data.statistics.totalOfficers})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-300 rounded-full"></div>
                    <span>Officials ({data.statistics.totalOfficials})</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Officers List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-sky-700 font-bold">
                  <Briefcase className="w-5 h-5" /> Officers (BPS 16-17)
                </div>
                <div className="space-y-3">
                  {data.hrOfficers.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-sky-50 rounded-md">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">BPS-{item.bps}</div>
                      </div>
                      <div className="bg-white px-2 py-1 rounded text-xs font-bold text-sky-600 shadow-sm">
                        {item.quantityRequired} Post{item.quantityRequired !== 1 && 's'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Officials List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-sky-700 font-bold">
                  <UserCheck className="w-5 h-5" /> Officials (BPS 1-16)
                </div>
                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
                  {data.hrOfficials.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-100">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">BPS-{item.bps}</div>
                      </div>
                      <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                        {item.quantityRequired}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Machinery Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Lab Equipment & Machinery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.machinery.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-4 h-full flex flex-col justify-between border-teal-100 bg-gradient-to-br from-white to-teal-50/30 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                      Qty: {item.quantityRequired}
                    </div>
                  </div>
                  {item.justificationOrYear && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {item.justificationOrYear}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
