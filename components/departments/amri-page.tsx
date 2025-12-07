"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Tractor, Wrench, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AMRIAsset {
  id: string;
  name: string;
  type: string;
  quantityOrArea: string | null;
  functionalStatus: string | null;
  remarks: string | null;
  imageUrl: string | null;
}

interface AMRIData {
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
  infrastructure: AMRIAsset[];
  machinery: AMRIAsset[];
  statistics: {
    totalMachinery: number;
    functionalMachinery: number;
    nonFunctionalMachinery: number;
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

const COLORS = ["#10b981", "#ef4444"]; // Green for Functional, Red for Non-Functional

export function AMRIPage() {
  const [data, setData] = useState<AMRIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/amri")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching AMRI data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Agricultural Mechanization Research Institute"
        description="Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions."
        image="/images/amri.jpg.jpeg"
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
        name="Agricultural Mechanization Research Institute"
        description="Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions."
        image="/images/amri.jpg.jpeg"
        focalPerson={{
          name: "Mr Ghulam Hussain",
          designation: "Director (T&T)",
          phone: "061-9200786",
          email: "",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">No data available. Please contact the administrator.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  const statusData = [
    { name: "Functional", value: data.statistics.functionalMachinery },
    { name: "Non-Functional", value: data.statistics.nonFunctionalMachinery },
  ];

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions."}
      image="/images/amri.jpg.jpeg"
      focalPerson={{
        name: data.department.focalPerson || "Mr Ghulam Hussain",
        designation: data.department.designation || "Director (T&T)",
        phone: data.department.phone || "061-9200786",
        email: data.department.email || "",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Infrastructure & Facilities */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Infrastructure & Facilities
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.infrastructure?.map((item) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 h-full border-orange-100 bg-gradient-to-br from-white to-orange-50 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{item.imageUrl}</div>
                    <Badge variant="outline" className="bg-white/50">{item.type}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">{item.name}</h3>
                  <div className="text-3xl font-black text-orange-600 mb-2">{item.quantityOrArea}</div>
                  <p className="text-sm text-orange-700/80">{item.remarks}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Machinery Statistics */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Machinery Overview
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg">
                <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Total Machinery</div>
                <div className="text-6xl font-black text-blue-600">{data.statistics.totalMachinery}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg">
                <div className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Functional</div>
                <div className="text-6xl font-black text-green-600">{data.statistics.functionalMachinery}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-red-50 border-red-100 shadow-lg">
                <div className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Non-Functional</div>
                <div className="text-6xl font-black text-red-600">{data.statistics.nonFunctionalMachinery}</div>
              </Card>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white shadow-lg border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

          </div>
        </section>

        {/* Full Machinery Inventory Table */}
        <section>
           <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
              Complete Machinery Inventory
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-xl border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold text-slate-600">#</th>
                      <th className="text-left py-4 px-6 font-bold text-slate-600">Machinery Name</th>
                      <th className="text-left py-4 px-6 font-bold text-slate-600">Quantity</th>
                      <th className="text-left py-4 px-6 font-bold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.machinery.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-6 text-slate-500">{index + 1}</td>
                        <td className="py-3 px-6 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 px-6 text-slate-600">{item.quantityOrArea}</td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-2">
                            {item.functionalStatus === "Functional" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={item.functionalStatus === "Functional" ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                              {item.functionalStatus}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
