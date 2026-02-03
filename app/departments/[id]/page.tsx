"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import department pages
import { MNSUAMPage } from "@/components/departments/mnsuam-page";
import { AMRIPage } from "@/components/departments/amri-page";
import { RARIPage } from "@/components/departments/rari-page";
import { FloriPage } from "@/components/departments/flori-page";
import { SoilWaterPage } from "@/components/departments/soil-water-page";
import { EntoPage } from "@/components/departments/ento-page";
import { MRIPage } from "@/components/departments/mri-page";
import { ExtPage } from "@/components/departments/ext-page";
import { CottonInstitutePage } from "@/components/departments/cotton-institute-page";
import { PestPage } from "@/components/departments/pest-page";
import { RAEDCPage } from "@/components/departments/raedc-page";
import { AgriEngPage } from "@/components/departments/agri-eng";
import { ARCPage } from "@/components/departments/arc-page";

const departmentPages: Record<string, React.ComponentType> = {
  mnsuam: MNSUAMPage,
  amri: AMRIPage,
  rari: RARIPage,
  flori: FloriPage,
  "soil-water": SoilWaterPage,
  ento: EntoPage,
  mri: MRIPage,
  ext: ExtPage,
  "cotton-institute": CottonInstitutePage,
  pest: PestPage,
  raedc: RAEDCPage,
  adp: ARCPage,
  arc: ARCPage,
  "agri-eng": AgriEngPage,
};

export default function DepartmentPage() {
  const params = useParams();
  const id = params.id as string;

  const DepartmentComponent = departmentPages[id];

  if (!DepartmentComponent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b bg-card">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/#departments" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Departments
            </Link>
          </Button>
        </div>
      </div>

      {/* Department Content */}
      <DepartmentComponent />
    </div>
  );
}
