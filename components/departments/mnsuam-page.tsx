"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  BarChart3, 
  Users, 
  Leaf, 
  Thermometer, 
  Sparkles,
  Microscope,
  Warehouse,
  Presentation,
  GraduationCap,
  Sprout,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Facility {
  id: string;
  name: string;
  blockName: string | null;
  facilityType: string | null;
  capacityPersons: number | null;
  capacityLabel?: string | null;
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

interface ValueAdditionEquipment {
  id: string;
  name: string;
  type: string;
  labName: string | null;
  roomNumber: string | null;
  blockName: string | null;
  quantity: number;
  focalPerson: string | null;
  displayOrder?: number | null;
  status?: string;
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
    valueAdditionSummary?: {
      totalEquipment: number;
      totalUnits: number;
    };
  };
  focalPersons: { name: string; role: string; email: string }[];
  notes: string;
  valueAdditionEquipment: ValueAdditionEquipment[];
}

const piePalette = ["#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac"];

const getFacilityIcon = (type: string | null, name: string) => {
  const lowerName = name.toLowerCase();
  const lowerType = type?.toLowerCase() || "";

  if (lowerName.includes("lab") || lowerType.includes("lab")) return Microscope;
  if (lowerName.includes("hall") || lowerType.includes("hall")) return Presentation;
  if (lowerName.includes("farm") || lowerType.includes("farm")) return Sprout;
  if (lowerName.includes("store") || lowerType.includes("store")) return Warehouse;
  if (lowerName.includes("class") || lowerType.includes("academic")) return GraduationCap;
  
  return Building2;
};

export function MNSUAMPage() {
  const [data, setData] = useState<MNSUAMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("estate");

  useEffect(() => {
    fetch("/api/departments/mnsuam")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MNSUAM data:", error);
        setData(null);
        setLoading(false);
      });
  }, []);

  const facilityDistribution = useMemo(() => {
    if (!data || !data.stats || !data.stats.blockSummary) return [];
    return data.stats.blockSummary.map((block, idx) => ({
      ...block,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  const equipmentDistribution = useMemo(() => {
    if (!data || !data.stats || !data.stats.equipmentSummary) return [];
    return data.stats.equipmentSummary.equipmentByType.map((item, idx) => ({
      ...item,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  const valueAdditionByLab = useMemo(() => {
    if (!data || !data.valueAdditionEquipment) return [];
    const grouped = data.valueAdditionEquipment.reduce((acc, item) => {
      const key = item.labName || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, ValueAdditionEquipment[]>);

    return Object.entries(grouped).map(([labName, equipment]) => ({
      labName,
      equipment: equipment.sort(
        (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
      ),
    }));
  }, [data]);

  const valueAdditionUnits = useMemo(() => {
    if (!data || !data.valueAdditionEquipment) return 0;
    return data.valueAdditionEquipment.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [data]);

  const valueAdditionTypeDistribution = useMemo(() => {
    if (!data || !data.valueAdditionEquipment) return [];
    const grouped = data.valueAdditionEquipment.reduce((acc, item) => {
      const key = item.type || "Other";
      acc[key] = (acc[key] || 0) + (item.quantity || 1);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped)
      .map(([type, count], idx) => ({
        type,
        count,
        fill: piePalette[idx % piePalette.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const valueAdditionLabStats = useMemo(() => {
    if (!data) return [];
    return valueAdditionByLab.map(({ labName, equipment }) => ({
      labName,
      items: equipment.length,
      units: equipment.reduce((sum, item) => sum + (item.quantity || 1), 0),
      room: equipment[0]?.roomNumber || "-",
      block: equipment[0]?.blockName || "-",
    }));
  }, [data, valueAdditionByLab]);

  const facilityTypeBreakdown = useMemo(() => {
    if (!data || !data.facilities) return [];
    const counts = data.facilities.reduce((acc, facility) => {
      const key = facility.facilityType || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([type, count], idx) => ({
        type,
        count,
        fill: piePalette[idx % piePalette.length],
      }))
      .sort((a, b) => b.count - a.count);
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
          name: "MNSUAM Focal Person",
          designation: "",
          phone: "",
          email: "estatedata.focalperson@mnsuam.edu.pk",
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
        name: data.department.focalPerson || "MNSUAM Focal Person",
        designation: data.department.designation || "",
        phone: data.department.phone || "",
        email: data.department.email || "estatedata.focalperson@mnsuam.edu.pk",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-12"
      >
        {/* Key Metrics */}
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Department snapshot</p>
              <h2 className="text-2xl font-bold text-foreground">Estate, Agronomy & Labs</h2>
            </div>
            <Badge variant="outline" className="text-foreground border-border/60">
              <MapPin className="w-4 h-4 mr-2" />
              {data.department.location || "MNSUAM"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="border border-border/60 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                  <Building2 className="w-4 h-4" />
                  <span>Estate Facilities</span>
                </div>
                <div className="text-4xl font-bold text-foreground">{data.stats.totalFacilities}</div>
                <p className="text-sm text-muted-foreground mt-1">Research & training spaces</p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-secondary font-medium">
                  <Users className="w-4 h-4" />
                  <span>Total Capacity</span>
                </div>
                <div className="text-4xl font-bold text-foreground">{data.stats.totalCapacity}</div>
                <p className="text-sm text-muted-foreground mt-1">Person capacity with backup power</p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                  <Leaf className="w-4 h-4" />
                  <span>Agronomy Toolkit</span>
                </div>
                <div className="text-4xl font-bold text-foreground">
                  {data.stats.equipmentSummary.totalUnits}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Units across {data.stats.equipmentSummary.totalTypes} specialized instruments
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-secondary font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Value Addition Lab</span>
                </div>
                <div className="text-4xl font-bold text-foreground">
                  {data.stats.valueAdditionSummary?.totalEquipment ?? data.valueAdditionEquipment.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {valueAdditionByLab.length} labs | {valueAdditionUnits} units
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {facilityTypeBreakdown.map((item) => (
              <Badge
                key={item.type}
                variant="secondary"
                className="flex items-center gap-2 border-border/60 text-foreground"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                {item.type}
                <span className="text-xs text-muted-foreground">({item.count})</span>
              </Badge>
            ))}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          defaultValue="estate"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8 rounded-2xl border border-border/60 bg-card/70 p-1">
            <TabsTrigger
              value="estate"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors border border-transparent data-[state=active]:border-border/70 data-[state=active]:bg-background"
            >
              <Building2 className="w-4 h-4" />
              Estate Data
            </TabsTrigger>
            <TabsTrigger
              value="agronomy"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors border border-transparent data-[state=active]:border-border/70 data-[state=active]:bg-background"
            >
              <Leaf className="w-4 h-4" />
              Agronomy Department
            </TabsTrigger>
            <TabsTrigger
              value="value-addition"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors border border-transparent data-[state=active]:border-border/70 data-[state=active]:bg-background"
            >
              <Sparkles className="w-4 h-4" />
              Value Addition & Food Analysis Lab
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estate" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <motion.section
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="space-y-6"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm border border-border/60 bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Capacity by Block
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer key={activeTab} width="100%" height={280}>
                      <BarChart data={facilityDistribution} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                          dataKey="blockName"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar dataKey="capacity" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border border-border/60 bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Presentation className="w-5 h-5 text-secondary" />
                      Space Mix by Facility Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                {facilityTypeBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No facility type data available.</p>
                ) : (
                  <ResponsiveContainer key={activeTab} width="100%" height={280}>
                    <PieChart>
                          <Pie
                            data={facilityTypeBreakdown}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={96}
                            paddingAngle={2}
                          >
                            {facilityTypeBreakdown.map((item) => (
                              <Cell key={item.type} fill={item.fill} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid hsl(var(--border))",
                              backgroundColor: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight">Estate Facilities</h3>
                  <p className="text-muted-foreground">Comprehensive infrastructure for research and academic activities</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-border/60 bg-background/80 backdrop-blur">
                  <Calendar className="w-4 h-4 mr-2" />
                  Check Availability
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.facilities.map((facility, idx) => {
                  const Icon = getFacilityIcon(facility.facilityType, facility.name);
                  return (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Card className="h-full border border-border/60 bg-background shadow-sm hover:shadow-md transition-colors duration-200 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                              <Icon className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary" className="font-normal bg-secondary/10 border-border/60 text-foreground">
                              {facility.type || facility.facilityType || "Estate"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                              {facility.blockName}
                            </p>
                            <h4 className="text-lg font-semibold text-foreground line-clamp-2 min-h-[3.5rem]">
                              {facility.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span>{facility.capacityLabel ?? `${facility.capacityPersons ?? "N/A"} Capacity`}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4" />
                                <span>{facility.facilityType}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              {data.notes && (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/10 border border-dashed border-border rounded-xl p-4 flex gap-3 items-start shadow-inner">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{data.notes}</p>
                </div>
              )}
            </motion.section>
          </TabsContent>

          <TabsContent value="agronomy" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <motion.section
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="space-y-6"
            >
              <Card className="shadow-sm pb-5 border border-border/60 bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Thermometer className="w-5 h-5 text-secondary" />
                    Equipment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {equipmentDistribution.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No equipment data available.</p>
                  ) : (
                    <ResponsiveContainer key={activeTab} width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={equipmentDistribution}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                        >
                          {equipmentDistribution.map((item, idx) => (
                            <Cell key={item.type} fill={item.fill} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Agronomy Equipment</h3>
                <p className="text-muted-foreground">Specialized tools and machinery for agricultural research</p>
              </div>

              <Card className="overflow-hidden border border-border/60 shadow-sm bg-background">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                      <tr>
                        <th className="py-4 px-6">Equipment Name</th>
                        <th className="py-4 px-6">Type / Category</th>
                        <th className="py-4 px-6 text-center">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {data.agronomyEquipment.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 px-6 text-sm text-muted-foreground text-center">
                            No agronomy equipment data available.
                          </td>
                        </tr>
                      )}
                      {data.agronomyEquipment.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-6 font-medium text-foreground">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <Microscope className="w-4 h-4" />
                              </div>
                              {item.name}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-secondary/10 text-secondary-foreground font-medium px-2">
                              {item.quantity}
                            </span>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.section>
          </TabsContent>

          <TabsContent value="value-addition" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <motion.section
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight">Value Addition & Food Analysis Lab</h3>
                  <p className="text-muted-foreground">
                    Snapshot of both Value Addition and Nutrient Analytical labs with functional status, focal contact, and room coverage.
                  </p>
                </div>
                <Card className="border border-border/60 bg-white">
                  <CardContent className="p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">Focal Contact</p>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {data.valueAdditionEquipment[0]?.focalPerson || "Dr. Shabbir Ahmad"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Email: Shabbir.ahmad@mnsuam.edu.pk</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                      <div className="rounded-lg border border-border/60 p-3">
                        <p className="text-xs text-muted-foreground">Equipment Lines</p>
                        <p className="text-xl font-semibold text-foreground">{data.valueAdditionEquipment.length}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 p-3">
                        <p className="text-xs text-muted-foreground">Total Units</p>
                        <p className="text-xl font-semibold text-foreground">{valueAdditionUnits}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 p-3">
                        <p className="text-xs text-muted-foreground">Labs</p>
                        <p className="text-xl font-semibold text-foreground">{valueAdditionByLab.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-border/60 bg-white">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Lab Coverage Overview</CardTitle>
                      <p className="text-sm text-muted-foreground">Room locations with items and unit counts per lab.</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{valueAdditionUnits} total units</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {valueAdditionLabStats.map((lab) => (
                    <div key={lab.labName} className="rounded-xl border border-border/60 p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{lab.labName}</p>
                        <Badge variant="secondary" className="text-[11px]">{lab.items} items</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Room {lab.room} • {lab.block}</p>
                      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                          <Sparkles className="w-3 h-3" />
                          {lab.units} units
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                          {lab.items} lines
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-border/60 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Distribution by Type</CardTitle>
                    <p className="text-sm text-muted-foreground">Unit share across key Value Addition equipment types.</p>
                  </CardHeader>
                  <CardContent>
                    {valueAdditionTypeDistribution.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No value addition equipment data available.</p>
                    ) : (
                      <ResponsiveContainer key={`${activeTab}-val-type`} width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={valueAdditionTypeDistribution}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                          >
                            {valueAdditionTypeDistribution.map((item) => (
                              <Cell key={item.type} fill={item.fill} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid hsl(var(--border))",
                              backgroundColor: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-border/60 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Items & Units by Lab</CardTitle>
                    <p className="text-sm text-muted-foreground">Comparative view of equipment lines and total units.</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer key={`${activeTab}-val-lab`} width="100%" height={280}>
                      <BarChart data={valueAdditionLabStats} layout="vertical" margin={{ left: 16, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis
                          type="category"
                          dataKey="labName"
                          width={140}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                          formatter={(value, name) => [value, name === "units" ? "Units" : "Items"]}
                        />
                        <Legend />
                        <Bar dataKey="items" name="Items" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="units" name="Units" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {valueAdditionByLab.length === 0 && (
                  <Card className="border border-border/60 bg-background shadow-sm">
                    <CardContent className="p-6 text-sm text-muted-foreground">No value addition equipment data available.</CardContent>
                  </Card>
                )}
                    {valueAdditionByLab.map(({ labName, equipment }) => {
                      const firstItem = equipment[0];
                      const totalUnits = equipment.reduce((sum, item) => sum + (item.quantity || 1), 0);
                      return (
                        <Card key={labName} className="shadow-sm border border-border/60 bg-white">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{labName}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  Room # {firstItem?.roomNumber} | {firstItem?.blockName}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {equipment.length} items
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {totalUnits} units
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {equipment.map((item, idx) => (
                           <Card key={item.id} className="border border-border/60 bg-white hover:border-primary/60 hover:shadow-md transition-colors">
                            <CardContent className="p-4 space-y-2">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                                  {item.displayOrder ?? idx + 1}
                                </div>
                                <div className="space-y-1 flex-1">
                                  <p className="font-semibold text-sm">{item.name}</p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-[11px]">
                                      {item.type}
                                    </Badge>
                                    {item.quantity > 1 && (
                                      <Badge variant="secondary" className="text-[11px]">
                                        Qty: {item.quantity}
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge
                                    variant={(item.status || "AVAILABLE") === "AVAILABLE" ? "default" : "secondary"}
                                    className={(item.status || "AVAILABLE") === "AVAILABLE" ? "bg-green-500 text-white text-[11px]" : "text-[11px]"}
                                  >
                                    {(item.status || "AVAILABLE") === "AVAILABLE" ? "Functional" : item.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.section>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold tracking-tight">Key Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.focalPersons.map((person, idx) => (
              <Card
                key={person.email}
                className="overflow-hidden border border-border/60 bg-background hover:border-primary/60 hover:shadow-md transition-colors"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={idx === 0 ? "default" : "secondary"}>
                        {person.role}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold">{person.name}</h4>
                    <p className="text-muted-foreground font-medium">{person.role}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border/50">
                      <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                        {person.email}
                      </a>
                      {idx === 0 && (
                        <a href={`tel:${data.department.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />
                          {data.department.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
