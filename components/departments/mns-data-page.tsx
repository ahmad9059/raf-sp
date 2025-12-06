"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";

export function MNSDataPage() {
  return (
    <DepartmentLayout
      name="Directorate of Agricultural Engineering"
      description="Comprehensive agricultural engineering services including farm machinery, infrastructure development, and technical support across multiple divisions."
      image="/images/agri.jpg.png"
      focalPerson={{
        name: "Engr. Muhammad Akram",
        designation: "Director Agricultural Engineering",
        phone: "+92-61-9210086",
        email: "akram@agrieng.gov.pk",
      }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engineering Services</h3>
        <p className="text-muted-foreground">
          Agricultural engineering support including machinery maintenance, infrastructure development, and technical services.
        </p>
      </Card>
    </DepartmentLayout>
  );
}
