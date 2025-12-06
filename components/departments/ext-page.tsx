"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";

export function ExtPage() {
  return (
    <DepartmentLayout
      name="Agriculture Extension Wing"
      description="Providing agricultural extension services, farmer training, and technology transfer to enhance farming practices across the region."
      image="/images/agri_ext.jpg.jpg"
      focalPerson={{
        name: "Dr. Ahmad Hassan",
        designation: "Director Extension",
        phone: "+92-61-9210076",
        email: "ahmad.hassan@ext.gov.pk",
      }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Extension Services</h3>
        <p className="text-muted-foreground">
          Comprehensive extension services including farmer training, technology demonstrations, and agricultural advisory services.
        </p>
      </Card>
    </DepartmentLayout>
  );
}
