"use client";

import { useEffect, useMemo, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Users,
  PieChart as PieIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AdaptiveResearchPosition {
  id: string;
  attachedDepartment: string | null;
  postName: string;
  bpsScale: string;
  sanctionedPosts: number;
  filledPosts: number;
  vacantPosts: number;
  promotionPosts: number;
  initialRecruitmentPosts: number;
  remarks: string | null;
  orderNumber: number | null;
}

interface AdaptiveResearchData {
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
  positions: AdaptiveResearchPosition[];
  stats: {
    totalSanctioned: number;
    totalFilled: number;
    totalVacant: number;
    promotionPosts: number;
    initialRecruitmentPosts: number;
    vacancyRate: number;
  };
  breakdown: {
    bpsBreakdown: { bps: string; sanctioned: number; filled: number; vacant: number }[];
    vacancyLeaders: AdaptiveResearchPosition[];
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
    },
  },
};

export function ARCPage() {
  const [data, setData] = useState<AdaptiveResearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/arc")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Adaptive Research Center data:", error);
        setData(null);
        setLoading(false);
      });
  }, []);

  const totalRecords = data?.positions.length || 0;

  const fillProgress = useMemo(() => {
    if (!data) return 0;
    return data.stats.totalSanctioned
      ? Math.round((data.stats.totalFilled / data.stats.totalSanctioned) * 100)
      : 0;
  }, [data]);

  if (loading) {
    return (
      <DepartmentLayout
        name="Adaptive Research Center"
        description="Monthly vacancy position for the Office of Assistant Director Agriculture (Farm), Govt. Agri. Station Multan."
        image="/images/adp.jpg.jpg"
        focalPerson={{
          name: "Loading...",
          designation: "",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DepartmentLayout>
    );
  }

  if (!data) {
    return (
      <DepartmentLayout
        name="Adaptive Research Center"
        description="Monthly vacancy position for the Office of Assistant Director Agriculture (Farm), Govt. Agri. Station Multan."
        image="/images/adp.jpg.jpg"
        focalPerson={{
          name: "Office of Assistant Director Agriculture (Farm)",
          designation: "Govt. Agri. Station Multan",
          phone: "",
          email: "",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">Unable to load Adaptive Research data right now.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout
      name={data.department.name || "Adaptive Research Center"}
      description={
        data.department.description ||
        "Monthly vacancy position for the Office of Assistant Director Agriculture (Farm), Govt. Agri. Station Multan."
      }
      image="/images/adp.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Office of Assistant Director Agriculture (Farm)",
        designation: data.department.designation || "Govt. Agri. Station Multan",
        phone: data.department.phone || undefined,
        email: data.department.email || undefined,
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
        {/* Top Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Sanctioned Posts", value: data.stats.totalSanctioned, icon: <BarChart3 className="w-8 h-8 text-slate-600" /> },
              {
                label: "Filled Posts",
                value: data.stats.totalFilled,
                icon: <CheckCircle2 className="w-8 h-8 text-slate-600" />,
                footer: (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Filled ratio</span>
                      <span className="font-semibold text-slate-900">{fillProgress}%</span>
                    </div>
                    <Progress value={fillProgress} className="h-2" />
                  </div>
                ),
              },
              { label: "Vacant Posts", value: data.stats.totalVacant, icon: <AlertTriangle className="w-8 h-8 text-slate-600" />, hint: `Vacancy rate ${data.stats.vacancyRate}%` },
              {
                label: "Pipeline",
                value: data.stats.promotionPosts + data.stats.initialRecruitmentPosts,
                icon: <ClipboardList className="w-8 h-8 text-slate-600" />,
                hint: `${data.stats.promotionPosts} Promotion • ${data.stats.initialRecruitmentPosts} Initial`,
              },
            ].map((card) => (
              <Card key={card.label} className="p-5 bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  </div>
                  {card.icon}
                </div>
                {card.footer}
                {card.hint && <p className="text-xs text-slate-500 mt-2">{card.hint}</p>}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="p-6 border-slate-200 shadow-sm bg-white">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">BPS Fill vs Vacant</h3>
                <p className="text-sm text-muted-foreground">Sanctioned strength with filled/vacant split by BPS scale.</p>
              </div>
              <Badge variant="outline" className="bg-slate-50">
                {totalRecords} roles
              </Badge>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.breakdown.bpsBreakdown} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bps" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="filled" name="Filled" stackId="a" fill="#0f9f6e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="vacant" name="Vacant" stackId="a" fill="#e11d48" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-4">
              <PieIcon className="w-5 h-5 text-slate-600" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Vacancy Rate</h3>
                <p className="text-sm text-muted-foreground">Overall fill progress across ARC.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-slate-900">{fillProgress}%</p>
                <p className="text-sm text-muted-foreground">filled</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">Vacancy rate</span>
                  <span className="font-semibold text-rose-700">{data.stats.vacancyRate}%</span>
                </div>
                <Progress value={100 - data.stats.vacancyRate} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {data.stats.totalFilled} of {data.stats.totalSanctioned} posts filled
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Promotion quota</span>
                  <span className="font-semibold text-slate-800">{data.stats.promotionPosts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Initial recruitment</span>
                  <span className="font-semibold text-slate-800">{data.stats.initialRecruitmentPosts}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Hotspots */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-slate-600" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Vacancy Hotspots</h3>
                <p className="text-sm text-muted-foreground">Roles with the highest open posts.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {data.breakdown.vacancyLeaders.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2">All positions are currently filled.</p>
              )}
              {data.breakdown.vacancyLeaders.map((pos) => {
                const fillRate = pos.sanctionedPosts ? Math.round((pos.filledPosts / pos.sanctionedPosts) * 100) : 0;
                return (
                  <div key={pos.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900">{pos.postName}</div>
                      <Badge variant="outline">{pos.bpsScale}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{pos.attachedDepartment || "ARC"}</div>
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span>Vacant</span>
                      <span className="font-semibold text-rose-700">{pos.vacantPosts}</span>
                    </div>
                    <Progress value={fillRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {pos.filledPosts} filled / {pos.sanctionedPosts} sanctioned
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Complete Vacancy Register</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed view of sanctioned, filled, and vacant posts with recruitment sources.
                </p>
              </div>
              <Badge variant="outline" className="bg-white">
                <Users className="w-4 h-4 mr-1" /> {totalRecords} roles
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Sr. No</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">
                      Name of Attached Department / Autonomous Bodies
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Nomenclature of the Post</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">BPS</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Total Sanctioned</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Filled</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Vacant</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Promotion</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Initial Recruitment</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.positions.map((pos, idx) => {
                    const fillRate = pos.sanctionedPosts ? Math.round((pos.filledPosts / pos.sanctionedPosts) * 100) : 0;
                    return (
                      <tr key={pos.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-3 text-slate-600">{(pos.orderNumber ?? idx + 1).toString().padStart(2, "0")}</td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-slate-900">
                            {pos.attachedDepartment ||
                              "DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan"}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-semibold text-slate-900">{pos.postName}</td>
                        <td className="px-6 py-3">
                          <Badge variant="outline">{pos.bpsScale}</Badge>
                        </td>
                        <td className="px-6 py-3 font-semibold">{pos.sanctionedPosts}</td>
                        <td className="px-6 py-3 text-emerald-700 font-semibold">{pos.filledPosts}</td>
                        <td className="px-6 py-3 text-rose-700 font-semibold">{pos.vacantPosts}</td>
                        <td className="px-6 py-3 text-center">{pos.promotionPosts}</td>
                        <td className="px-6 py-3 text-center">{pos.initialRecruitmentPosts}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Progress value={fillRate} className="h-1.5" />
                              <div className="text-[10px] text-muted-foreground mt-1">{fillRate}% filled</div>
                              {pos.remarks && <div className="text-xs text-slate-700 mt-1">{pos.remarks}</div>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DepartmentLayout>
  );
}
