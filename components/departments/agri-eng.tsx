"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, Tractor, Activity, Zap, Drill } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AgriEngData {
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
  buildingDetails: {
    id: string;
    name: string;
    divisionOrCity: string;
    quantityOrArea: string;
  }[];
  farmMachinery: {
    bulldozers: { name: string; quantityOrArea: string }[];
    handBoringPlants: { name: string; quantityOrArea: string }[];
    powerDrillingRigs: { name: string; quantityOrArea: string }[];
    electricResistivityMeters: { name: string; quantityOrArea: string }[];
  };
  humanResources: {
    id: string;
    name: string;
    quantityOrArea: string;
  }[];
  statistics: {
    totalBuildings: number;
    totalMachinery: number;
    totalHR: number;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AgriEngPage() {
  const [data, setData] = useState<AgriEngData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/agri-eng")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Agri Engineering data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Agriculture Engineering Field Wing"
        description="Loading..."
        image="/images/agri.jpg.png"
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
        name="Agriculture Engineering Field Wing"
        description="Agricultural Engineering Department responsible for land development, water conservation, and farm mechanization."
        image="/images/agri.jpg.png"
        focalPerson={{
          name: "Mr. Muhammad Abdul Haye Faisal",
          designation: "Director Agricultural (Technical) Multan",
          phone: "0334-7456723",
          email: "daemultan@yahoo.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">No data available. Please contact the administrator.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  // Prepare data for charts
  const buildingByDivision = data.buildingDetails.reduce((acc, curr) => {
    const division = curr.divisionOrCity || "Unknown";
    acc[division] = (acc[division] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const buildingChartData = Object.entries(buildingByDivision).map(([name, value]) => ({ name, value }));

  const machineryData = [
    { name: "Bulldozers", value: data.farmMachinery.bulldozers.reduce((acc, curr) => acc + parseInt(curr.quantityOrArea || "0"), 0) },
    { name: "Hand Boring Plants", value: data.farmMachinery.handBoringPlants.reduce((acc, curr) => acc + parseInt(curr.quantityOrArea || "0"), 0) },
    { name: "Power Drilling Rigs", value: data.farmMachinery.powerDrillingRigs.reduce((acc, curr) => acc + parseInt(curr.quantityOrArea || "0"), 0) },
    { name: "Resistivity Meters", value: data.farmMachinery.electricResistivityMeters.reduce((acc, curr) => acc + parseInt(curr.quantityOrArea || "0"), 0) },
  ];

  return (
    <DepartmentLayout
      name="Agriculture Engineering Field Wing"
      description={data.department.description || "Agricultural Engineering Department responsible for land development, water conservation, and farm mechanization."}
      image="/images/agri.jpg.png"
      focalPerson={{
        name: data.department.focalPerson || "Mr. Muhammad Abdul Haye Faisal",
        designation: data.department.designation || "Director Agricultural (Technical) Multan",
        phone: data.department.phone || "0334-7456723",
        email: data.department.email || "daemultan@yahoo.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-orange-50 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-orange-100 rounded-full text-orange-600 shadow-inner">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Building Details</div>
              <div className="text-5xl font-black text-orange-600">{data.statistics.totalBuildings}</div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-yellow-50 border-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 shadow-inner">
                  <Tractor className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-2">Farm Machinery</div>
              <div className="text-5xl font-black text-yellow-600">{data.statistics.totalMachinery}</div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600 shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Human Resources</div>
              <div className="text-5xl font-black text-blue-600">{data.statistics.totalHR}</div>
            </Card>
          </motion.div>
        </div>

        {/* Building Details */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Building Details Breakdown
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
              <Card className="p-6 h-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-orange-50/30 shadow-lg border-orange-100">
                <h3 className="text-lg font-bold text-orange-900 mb-4">Division Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={buildingChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {buildingChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #f97316',
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="p-0 overflow-hidden bg-white shadow-lg border-orange-100">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                  <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" /> Building Details List
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-orange-800 uppercase bg-orange-50/50">
                      <tr>
                        <th className="px-6 py-4 font-bold">Sr. No.</th>
                        <th className="px-6 py-4 font-bold">Name of Office</th>
                        <th className="px-6 py-4 font-bold">Total Area</th>
                        <th className="px-6 py-4 font-bold">Division</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50">
                      {data.buildingDetails.map((item, index) => (
                        <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-orange-900/70">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 text-gray-600">{item.quantityOrArea}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold shadow-sm">
                              {item.divisionOrCity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Farm Machinery Status */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
              Farm Machinery Status
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <motion.div variants={itemVariants}>
               <Card className="p-6 bg-gradient-to-br from-white to-yellow-50/30 shadow-lg border-yellow-100 h-full">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4">Machinery Overview</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={machineryData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#854d0e'}} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #eab308',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                          }}
                        />
                        <Bar dataKey="value" fill="#eab308" radius={[0, 4, 4, 0]}>
                          {machineryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#eab308', '#f59e0b', '#d97706', '#b45309'][index % 4]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </Card>
             </motion.div>

             <motion.div variants={itemVariants} className="space-y-4">
                {/* Bulldozers Table */}
                <Card className="overflow-hidden bg-white shadow-lg border-yellow-100">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                      <Tractor className="w-5 h-5 text-yellow-600" /> Bulldozers
                    </h4>
                  </div>
                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-yellow-50/50 text-xs uppercase text-yellow-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold">Office</th>
                          <th className="px-4 py-2 text-right font-bold">Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-50">
                        {data.farmMachinery.bulldozers.map((item, idx) => (
                          <tr key={idx} className="hover:bg-yellow-50/30 transition-colors">
                            <td className="px-4 py-2 text-gray-700">{item.name}</td>
                            <td className="px-4 py-2 text-right font-bold text-yellow-600">{item.quantityOrArea}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
             </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Hand Boring Plants */}
             <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
               <Card className="overflow-hidden bg-white shadow-lg border-blue-100 h-full">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2">
                      <Drill className="w-5 h-5 text-blue-600" /> Hand Boring Plants
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-50/50 text-xs uppercase text-blue-800">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold">Office</th>
                          <th className="px-4 py-2 text-right font-bold">No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {data.farmMachinery.handBoringPlants.map((item, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-2 text-gray-700">{item.name}</td>
                            <td className="px-4 py-2 text-right font-bold text-blue-600">{item.quantityOrArea}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Card>
             </motion.div>

             {/* Power Drilling Rigs */}
             <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
               <Card className="overflow-hidden bg-white shadow-lg border-purple-100 h-full">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b border-purple-100">
                    <h4 className="font-bold text-purple-800 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" /> Power Drilling Rigs
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-purple-50/50 text-xs uppercase text-purple-800">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold">Office</th>
                          <th className="px-4 py-2 text-right font-bold">No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-50">
                        {data.farmMachinery.powerDrillingRigs.map((item, idx) => (
                          <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                            <td className="px-4 py-2 text-gray-700">{item.name}</td>
                            <td className="px-4 py-2 text-right font-bold text-purple-600">{item.quantityOrArea}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Card>
             </motion.div>

             {/* Electricity Resistivity Meters */}
             <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
               <Card className="overflow-hidden bg-white shadow-lg border-green-100 h-full">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <h4 className="font-bold text-green-800 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" /> Resistivity Meters
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-green-50/50 text-xs uppercase text-green-800">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold">Office</th>
                          <th className="px-4 py-2 text-right font-bold">No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-50">
                        {data.farmMachinery.electricResistivityMeters.map((item, idx) => (
                          <tr key={idx} className="hover:bg-green-50/30 transition-colors">
                            <td className="px-4 py-2 text-gray-700">{item.name}</td>
                            <td className="px-4 py-2 text-right font-bold text-green-600">{item.quantityOrArea}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Card>
             </motion.div>
          </div>
        </section>

        {/* Human Resources */}
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
              Human Resources
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div variants={itemVariants}>
               <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 shadow-lg border-blue-100 h-full">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Staff Distribution</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.humanResources.map(hr => ({
                          name: hr.name.replace("Director Agricultural Engineering", "DAE").replace("Assistant Director", "AD"),
                          value: parseInt(hr.quantityOrArea || "0"),
                          fullName: hr.name
                        }))}
                        layout="vertical"
                        margin={{ left: 10, right: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 10, fill: '#1e40af'}} />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-blue-200 shadow-lg rounded-lg">
                                <p className="font-bold text-sm text-blue-900 mb-1">{data.fullName}</p>
                                <p className="text-blue-600 font-semibold">Count: {data.value}</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                          {data.humanResources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb'][index % 4]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </Card>
             </motion.div>

             <motion.div variants={itemVariants}>
               <Card className="p-0 overflow-hidden bg-white shadow-lg border-blue-100 h-full max-h-[500px] flex flex-col">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" /> Staff Details
                    </h3>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-blue-800 uppercase bg-blue-50/50 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 font-bold">Office / Designation</th>
                          <th className="px-6 py-4 font-bold text-right">Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {data.humanResources.map((item, index) => (
                          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                            <td className="px-6 py-4 text-right font-bold text-blue-600">{item.quantityOrArea}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Card>
             </motion.div>
          </div>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
