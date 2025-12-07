"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bug, Calendar, FileText, Package, Search, Users, User, MapPin, Home } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Input } from "@/components/ui/input";

interface StockItem {
  id: string;
  name: string;
  registerPageNo: number | null;
  quantityStr: string | null;
  dateReceived: string | null;
  lastVerificationDate: string | null;
  currentStatusRemarks: string | null;
}

interface EntoData {
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
  stockItems: StockItem[];
  statistics: {
    totalItems: number;
    uniqueItems: number;
    itemsByYear: Record<string, number>;
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

export function EntoPage() {
  const [data, setData] = useState<EntoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/departments/ento")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Ento data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Entomological Research Sub Station"
        description="Loading..."
        image="/images/ent.jpg.jpg"
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
        name="Entomological Research Sub Station"
        description="Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture."
        image="/images/ent.jpg.jpg"
        focalPerson={{
          name: "Dr. Asifa Hameed",
          designation: "Principal Scientist",
          phone: "+92-61-9210075",
          email: "asifa_hameed_sheikh@yahoo.com",
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

  // Prepare chart data
  const yearData = Object.entries(data.statistics.itemsByYear)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => (a.year === "Unknown" ? 1 : b.year === "Unknown" ? -1 : a.year.localeCompare(b.year)));

  // Filter items
  const filteredItems = data.stockItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture."}
      image="/images/ent.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Asifa Hameed",
        designation: data.department.designation || "Principal Scientist",
        phone: data.department.phone || "+92-61-9210075",
        email: data.department.email || "asifa_hameed_sheikh@yahoo.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Department Resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
            <Card className="p-6 flex flex-col items-center justify-center bg-white border-green-100 shadow-md hover:shadow-lg transition-all">
              <div className="p-3 bg-green-100 rounded-full text-green-600 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-green-700">3</div>
              <div className="text-xs font-medium text-green-500 uppercase tracking-wide">Officers</div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
            <Card className="p-6 flex flex-col items-center justify-center bg-white border-emerald-100 shadow-md hover:shadow-lg transition-all">
              <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 mb-3">
                <User className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-emerald-700">2</div>
              <div className="text-xs font-medium text-emerald-500 uppercase tracking-wide">Officials</div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
            <Card className="p-6 flex flex-col items-center justify-center bg-white border-teal-100 shadow-md hover:shadow-lg transition-all">
              <div className="p-3 bg-teal-100 rounded-full text-teal-600 mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-teal-700">3.5</div>
              <div className="text-xs font-medium text-teal-500 uppercase tracking-wide">Acres Land</div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
            <Card className="p-6 flex flex-col items-center justify-center bg-white border-cyan-100 shadow-md hover:shadow-lg transition-all">
              <div className="p-3 bg-cyan-100 rounded-full text-cyan-600 mb-3">
                <Home className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-cyan-700">5</div>
              <div className="text-xs font-medium text-cyan-500 uppercase tracking-wide">Rooms Occupied</div>
            </Card>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full text-green-600 shadow-inner">
                  <Package className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                Total Items
              </div>
              <div className="text-5xl font-black text-green-600">
                {data.statistics.totalItems}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 shadow-inner">
                  <Bug className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Unique Items
              </div>
              <div className="text-5xl font-black text-emerald-600">
                {data.statistics.uniqueItems}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-white to-teal-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-teal-100 rounded-full text-teal-600 shadow-inner">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-2">
                Years Covered
              </div>
              <div className="text-5xl font-black text-teal-600">
                {yearData.length}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              Inventory Timeline
            </h2>
          </motion.div>

          <Card className="p-6 bg-white shadow-lg border-green-100">
            <h3 className="text-lg font-bold text-green-900 mb-4">
              Items Received by Year
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                  <XAxis dataKey="year" tick={{ fill: '#166534' }} />
                  <YAxis tick={{ fill: '#166534' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #22c55e',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]}>
                    {yearData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#22c55e', '#16a34a', '#15803d', '#166534'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Inventory List */}
        <section>
          <motion.div
            className="flex items-center justify-between gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
                Stock Register
              </h2>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-teal-200 focus:ring-teal-500"
              />
            </div>
          </motion.div>

          <Card className="overflow-hidden bg-white shadow-lg border-teal-100">
            <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
              <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" /> Non-Consumable Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-teal-800 uppercase bg-teal-50/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-bold">Page #</th>
                    <th className="px-6 py-4 font-bold">Item Name</th>
                    <th className="px-6 py-4 font-bold">Quantity</th>
                    <th className="px-6 py-4 font-bold">Date Received</th>
                    <th className="px-6 py-4 font-bold">Last Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-teal-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-teal-900/70">
                          {item.registerPageNo || "-"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.quantityStr}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.dateReceived
                            ? new Date(item.dateReceived).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold shadow-sm">
                            {item.lastVerificationDate || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No items found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
