"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FlaskConical, Tractor, MapPin, Home } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FloriAsset {
  id: string;
  name: string;
  type: string;
  category: string;
  itemNameOrPost: string | null;
  bpsScale: string | null;
  sanctionedQty: number | null;
  inPositionQty: number | null;
  detailsOrArea: string | null;
}

interface FloriData {
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
  landData: FloriAsset[];
  buildingData: FloriAsset[];
  farmMachinery: FloriAsset[];
  labEquipment: FloriAsset[];
  hrData: FloriAsset[];
  statistics: {
    totalStaff: number;
    totalVacant: number;
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

const COLORS = ["#22c55e", "#ef4444", "#eab308", "#3b82f6"];

export function FloriPage() {
  const [data, setData] = useState<FloriData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/flori")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Flori data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Floriculture Research Institute"
        description="Loading..."
        image="/images/flori.jpg.jpg"
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
        name="Floriculture Research Institute"
        description="Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development."
        image="/images/flori.jpg.jpg"
        focalPerson={{
          name: "Dr. Muhammad Muzamil Ijaz",
          designation: "Assistant Research Officer",
          phone: "03016984364",
          email: "muzamil.ijaz243@gmail.com",
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

  // Prepare Pie Chart Data for Land
  const cultivated = parseFloat(data.landData.find(d => d.name === "Cultivated Area")?.detailsOrArea || "0");
  const nonCultivated = parseFloat(data.landData.find(d => d.name === "Non-Cultivated Area")?.detailsOrArea || "0");
  
  const landChartData = [
    { name: "Cultivated Area", value: cultivated },
    { name: "Non-Cultivated Area", value: nonCultivated },
  ];

  // Prepare Bar Chart Data for HR
  const hrChartData = data.hrData.map(item => ({
    name: item.itemNameOrPost,
    sanctioned: item.sanctionedQty || 0,
    inPosition: item.inPositionQty || 0,
  }));

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development."}
      image="/images/flori.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Muhammad Muzamil Ijaz",
        designation: data.department.designation || "Assistant Research Officer",
        phone: data.department.phone || "03016984364",
        email: data.department.email || "muzamil.ijaz243@gmail.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Top Row: Land & Building */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Land Resources */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full border-green-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-green-100 text-green-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-green-900">Land Resources</h3>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="h-[200px] w-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={landChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {landChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-green-700">
                      {data.landData.find(d => d.name === "Total Area")?.detailsOrArea}
                    </span>
                    <span className="text-xs text-green-600 font-medium">Total Acres</span>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-900">Cultivated</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">{cultivated}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-900">Non-Cultivated</span>
                    </div>
                    <span className="text-lg font-bold text-red-700">{nonCultivated}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Building Details */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full border-amber-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-amber-900">Building Details</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center h-[200px]">
                <div className="text-6xl font-black text-amber-500 mb-2">
                  {data.buildingData[0]?.detailsOrArea?.split(' ')[0]}
                </div>
                <div className="text-lg font-medium text-amber-700 uppercase tracking-wider">
                  {data.buildingData[0]?.detailsOrArea?.split(' ').slice(1).join(' ')}
                </div>
                <div className="mt-4 px-4 py-2 bg-amber-50 rounded-full text-amber-800 font-medium">
                  {data.buildingData[0]?.name}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Middle Row: Machinery & Lab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farm Machinery */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-blue-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Tractor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">Farm Machinery</h3>
              </div>
              
              <div className="space-y-3">
                {data.farmMachinery.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <span className="font-medium text-blue-900">{item.name}</span>
                    <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-bold shadow-sm">
                      {item.sanctionedQty} unit
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Lab Equipment */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-purple-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-purple-900">Lab Equipment</h3>
              </div>
              
              <div className="space-y-3">
                {data.labEquipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="font-medium text-purple-900">{item.name}</span>
                    <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-bold shadow-sm">
                      {item.sanctionedQty} unit
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row: Human Resources */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-orange-100 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-orange-900">Human Resources</h3>
            </div>

            <div className="mb-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hrChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fill: '#9a3412', fontSize: 12 }} 
                  />
                  <YAxis tick={{ fill: '#9a3412' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #f97316',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="sanctioned" fill="#f97316" name="Sanctioned" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-orange-800 uppercase bg-orange-50">
                  <tr>
                    <th className="px-6 py-3">Sr. #</th>
                    <th className="px-6 py-3">Name of Post</th>
                    <th className="px-6 py-3">BPS</th>
                    <th className="px-6 py-3 text-center">Sanctioned</th>
                    <th className="px-6 py-3 text-center">In Position</th>
                    <th className="px-6 py-3 text-center">Vacant</th>
                    <th className="px-6 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {data.hrData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-orange-50/50">
                      <td className="px-6 py-4 font-medium text-orange-900">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.itemNameOrPost}</td>
                      <td className="px-6 py-4 text-gray-600">{item.bpsScale}</td>
                      <td className="px-6 py-4 text-center font-bold text-orange-600">{item.sanctionedQty}</td>
                      <td className="px-6 py-4 text-center font-bold text-green-600">{item.inPositionQty}</td>
                      <td className="px-6 py-4 text-center font-bold text-red-600">
                        {(item.sanctionedQty || 0) - (item.inPositionQty || 0)}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">{item.sanctionedQty}</td>
                    </tr>
                  ))}
                  <tr className="bg-orange-100 font-bold">
                    <td colSpan={3} className="px-6 py-4 text-orange-900">TOTAL</td>
                    <td className="px-6 py-4 text-center text-orange-900">{data.statistics.totalStaff}</td>
                    <td className="px-6 py-4 text-center text-orange-900">
                      {data.hrData.reduce((sum, item) => sum + (item.inPositionQty || 0), 0)}
                    </td>
                    <td className="px-6 py-4 text-center text-orange-900">{data.statistics.totalVacant}</td>
                    <td className="px-6 py-4 text-center text-orange-900">{data.statistics.totalStaff}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DepartmentLayout>
  );
}
