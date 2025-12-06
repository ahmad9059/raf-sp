"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FlaskConical, Tractor } from "lucide-react";

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
  statistics: {
    totalLabEquipment: number;
    functionalLab: number;
    nonFunctionalLab: number;
    totalFarmMachinery: number;
  };
}

const landData = [
  { label: "Total Area", value: "24.6 acres" },
  { label: "Under Cultivation", value: "19.6 acres" },
  { label: "Buildings & Infrastructure", value: "4 acres" },
  { label: "Roads & Pathways", value: "1 acre" },
];

const buildingData = [
  { label: "Building Rooms", value: "20" },
  { label: "Laboratories", value: "5" },
];

const hrData = [
  { label: "Total Officers", value: "18" },
  { label: "Officials & Field Staff", value: "32" },
  { label: "Total Positions", value: "50" },
  { label: "Vacant Officer Positions", value: "4" },
];

const labEquipment = [
  { name: "Electrical Penetration Graph", model: "GIGA-8d DC amplifier", department: "Integrated Pest Management Lab", status: "Functional" },
  { name: "Electrical Germinator", model: "Theijang Top Cloud Agri Tech. Co. Ltd", department: "Integrated Pest Management Lab", status: "Functional" },
  { name: "Spectrophotometer", model: "K5600S-KAIRO", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "HPLC", model: "GB/T26792-2019", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Atomic Absorption Spectroscopy", model: "AA6100+", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Digital Droplet PCR", model: "D3200PRO", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Automatic DNA Extraction Unit", model: "BFEX-96E", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Tissue Grinder", model: "NO3D13", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Fluorescence Microscope", model: "MF-43M", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Incubator", model: "MDS-200", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Freezer -20°C", model: "MDF-40H485", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Refrigerated Centrifuge", model: "Velocity30R", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "Stereoscope", model: "Euromex Microscopes Holland", department: "Integrated Pest Management Lab", status: "Functional" },
  { name: "Light Microscope", model: "Euromex Microscopes Holland", department: "Integrated Pest Management Lab", status: "Functional" },
  { name: "IRGA", model: "CID BIOSCIENCE CI-340", department: "Physiology Lab", status: "Non-Functional" },
  { name: "Drying Oven", model: "RΔYPΔ", department: "Integrated Pest Management Lab", status: "Functional" },
  { name: "Gradient PCR", model: "FC-96B", department: "Molecular Biology Lab", status: "Non-Functional" },
  { name: "HVI", model: "Uster HVI-1000", department: "Fiber Testing Laboratory", status: "Functional" },
];

const farmMachinery = [
  { name: "Massey Ferguson-375", year: "1999", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Massey Ferguson-240", year: "1991", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Cultivator (13-tines)", year: "2012", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Chisel Plough", year: "1998", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Trolley for Tractor (12X7ft)", year: "-", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Disc Plough", year: "2017", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Fertilizer Spreader", year: "2000", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Land Leveler", year: "2014", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Boom Sprayer", year: "2008", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Laser Land Leveler", year: "2016", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Ridger for Bed & Furrow", year: "1998", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Automatic Kharif Drill", year: "2018", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Rotavator (42 blades)", year: "2012", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Water Tank", year: "2017", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Timmy Rotary Weeder", year: "1999", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Cotton Ridger with Fertilizer", year: "1998", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Cotton Hand Drill", year: "2005", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Tractor Driven Tarphali", year: "2008", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Disc Harrow", year: "2016", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Ditcher", year: "2017", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Wheat Straw Slasher", year: "2017", location: "CRI, Farm Shed", status: "Functional" },
  { name: "Thresher with Elevator", year: "2018", location: "CRI, Farm Shed", status: "Functional" },
];

const functionalCount = labEquipment.filter(e => e.status === "Functional").length;
const nonFunctionalCount = labEquipment.filter(e => e.status === "Non-Functional").length;

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
      {/* Land & Infrastructure Assets */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Land & Infrastructure Assets</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {landData.map((item, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {buildingData.map((item, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Human Resource Assets */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Human Resource Assets</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hrData.map((item, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Laboratory Equipment Analysis */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Laboratory Equipment Analysis</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Total Equipment</div>
            <div className="text-4xl font-bold text-primary">{data.statistics.totalLabEquipment}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Functional Equipment</div>
            <div className="text-4xl font-bold text-green-600">{data.statistics.functionalLab}</div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Key Equipment Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Equipment</th>
                  <th className="text-left py-3 px-4 font-semibold">Department</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.labEquipment.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.labDepartment}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={item.operationalStatus === "Functional" ? "bg-green-600" : "bg-red-600"}>
                        {item.operationalStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Key Observation:</strong> The majority lab facilities are in non-functional state. Procurement of lab chemicals is under process. This data is provided to establish the South Punjab Regional Agriculture Forum.
          </p>
        </Card>
      </div>

      {/* Farm Machinery Analysis */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Tractor className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Farm Machinery Analysis</h2>
        </div>

        <Card className="p-6 text-center mb-6">
          <div className="text-sm text-muted-foreground mb-2">Total Machinery</div>
          <div className="text-4xl font-bold text-primary">{data.statistics.totalFarmMachinery}</div>
          <div className="text-sm text-green-600 mt-2">All equipment functional</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Important Farm Machinery</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Machinery</th>
                  <th className="text-center py-3 px-4 font-semibold">Model/Year</th>
                  <th className="text-left py-3 px-4 font-semibold">Location</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.farmMachinery.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-center text-sm">{item.year || "-"}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.location}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-green-600">{item.operationalStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-4 mt-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-900">
            <strong>Key Observation:</strong> The machinery lab facilities are in very good state. Procurement of lab chemicals is under process. This data is provided to establish the South Punjab Regional Agriculture Forum.
          </p>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Institute Information</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Address:</strong> {data.department.location || "Old Shujabad Road Multan"}</p>
          <p><strong>Tel:</strong> {data.department.phone || "+92-61-9200337"}</p>
          <p><strong>Email:</strong> {data.department.email || "dircrimm@gmail.com"}</p>
          <p className="mt-4 pt-4 border-t"><strong>Focal Person:</strong> {data.department.focalPerson}</p>
          <p><strong>Designation:</strong> {data.department.designation}</p>
        </div>
      </Card>
    </DepartmentLayout>
  );
}
