"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, Tractor, MapPin, Home, UserCheck, UserX, Ruler, Warehouse, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MRIAsset {
  id: string;
  name: string;
  type: string;
  category: string;
  itemNameOrDesignation: string | null;
  bpsScale: number | null;
  totalQuantityOrPosts: number | null;
  filledOrFunctional: number | null;
  vacantOrNonFunctional: number | null;
  remarksOrLocation: string | null;
}

interface MRIData {
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
  landData: MRIAsset[];
  buildingData: MRIAsset[];
  farmMachinery: MRIAsset[];
  labEquipment: MRIAsset[];
  hrData: MRIAsset[];
  statistics: {
    totalPosts: number;
    filledPosts: number;
    vacantPosts: number;
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

const HR_COLORS = ["#8b5cf6", "#ef4444"]; // Violet for Filled, Red for Vacant
const LAND_COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd"]; // Shades of Violet

export function MRIPage() {
  const [data, setData] = useState<MRIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/mri")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MRI data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Mango Research Institute"
        description="Loading..."
        image="/images/mango.jpg.jpg"
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
        name="Mango Research Institute"
        description="Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement."
        image="/images/mango.jpg.jpg"
        focalPerson={{
          name: "Mr. Abid Hameed Khan",
          designation: "Scientific Officer- Entomology",
          phone: "0300-6326987",
          email: "abidhameedkhan@yahoo.com",
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
    { name: "Filled", value: data.statistics.filledPosts },
    { name: "Vacant", value: data.statistics.vacantPosts },
  ];

  // Helper to get land data safely
  const getLandValue = (name: string) => data.landData.find(d => d.name === name)?.remarksOrLocation || "0";
  const getBuildingValue = (name: string) => data.buildingData.find(d => d.name === name)?.totalQuantityOrPosts || 0;
  const getBuildingArea = () => data.buildingData.find(d => d.name === "Building Area")?.remarksOrLocation?.split(' ')[0] || "0";

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement."}
      image="/images/mango.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Mr. Abid Hameed Khan",
        designation: data.department.designation || "Scientific Officer- Entomology",
        phone: data.department.phone || "0300-6326987",
        email: data.department.email || "abidhameedkhan@yahoo.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Land & Infrastructure Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">
              Land & Infrastructure
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-purple-100 bg-gradient-to-b from-white to-purple-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MapPin className="w-16 h-16 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-600 mb-2 tracking-tight">{getLandValue("Total Area")}</div>
                <div className="text-sm font-medium text-purple-800/70 uppercase tracking-wide">Total Area</div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-purple-100 bg-gradient-to-b from-white to-purple-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tractor className="w-16 h-16 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-600 mb-2 tracking-tight">{getLandValue("Direct Cultivated Area")}</div>
                <div className="text-sm font-medium text-purple-800/70 uppercase tracking-wide">Cultivated Area</div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-purple-100 bg-gradient-to-b from-white to-purple-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home className="w-16 h-16 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-600 mb-2 tracking-tight">{getLandValue("Office")}</div>
                <div className="text-sm font-medium text-purple-800/70 uppercase tracking-wide">Office Area</div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-purple-100 bg-gradient-to-b from-white to-purple-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="w-16 h-16 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-600 mb-2 tracking-tight">{getLandValue("Roads & Buildings")}</div>
                <div className="text-sm font-medium text-purple-800/70 uppercase tracking-wide">Roads & Buildings</div>
              </Card>
            </motion.div>
          </div>

          {/* Building Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 text-center border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Ruler className="w-8 h-8 text-violet-500" />
                    <div>
                      <div className="text-2xl font-bold text-violet-700">{getBuildingArea()}</div>
                      <div className="text-xs font-medium text-violet-600 uppercase">Acres Built</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 text-center border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Warehouse className="w-8 h-8 text-violet-500" />
                    <div>
                      <div className="text-2xl font-bold text-violet-700">{getBuildingValue("Rooms")}</div>
                      <div className="text-xs font-medium text-violet-600 uppercase">Rooms</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 text-center border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Droplets className="w-8 h-8 text-violet-500" />
                    <div>
                      <div className="text-2xl font-bold text-violet-700">{getBuildingValue("Men Washroom")}</div>
                      <div className="text-xs font-medium text-violet-600 uppercase">Men Washroom</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card className="p-6 text-center border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Droplets className="w-8 h-8 text-pink-500" />
                    <div>
                      <div className="text-2xl font-bold text-violet-700">{getBuildingValue("Women Washroom")}</div>
                      <div className="text-xs font-medium text-violet-600 uppercase">Women Washroom</div>
                    </div>
                  </div>
                </Card>
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Human Resource Status
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-lg">
                <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Total Posts</div>
                <div className="text-6xl font-black text-indigo-600">{data.statistics.totalPosts}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg">
                <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Filled Posts</div>
                <div className="text-6xl font-black text-emerald-600">{data.statistics.filledPosts}</div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-8 text-center bg-gradient-to-br from-white to-red-50 border-red-100 shadow-lg">
                <div className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Vacant Posts</div>
                <div className="text-6xl font-black text-red-600">{data.statistics.vacantPosts}</div>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* HR Pie Chart */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full border-purple-200 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
                <h3 className="text-center text-gray-700 font-medium mb-6">Staff Distribution</h3>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hrChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
                      <div className="text-3xl font-bold text-gray-800">{data.statistics.totalPosts}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Filled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Vacant</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Detailed HR List (Optional, if we want to show breakdown) */}
             <motion.div variants={itemVariants} className="h-full">
                <Card className="p-6 h-full border-purple-200 shadow-lg overflow-y-auto max-h-[400px]">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Designation Breakdown
                  </h3>
                  <div className="space-y-3">
                    {data.hrData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 shadow-sm">
                        <div>
                          <div className="font-medium text-gray-800">{item.itemNameOrDesignation}</div>
                          <div className="text-xs text-gray-500">BPS-{item.bpsScale}</div>
                        </div>
                        <div className="flex gap-3 text-sm">
                           <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">{item.filledOrFunctional} Filled</span>
                           <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">{item.vacantOrNonFunctional} Vacant</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
             </motion.div>
          </div>
        </section>

        {/* Farm Machinery Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
              Farm Machinery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.farmMachinery.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-4 flex items-center justify-between border-amber-100 bg-gradient-to-r from-white to-amber-50/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xl font-bold text-amber-600">{item.totalQuantityOrPosts}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
