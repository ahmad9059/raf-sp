"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";

export function ADPPage() {
  return (
    <DepartmentLayout
      name="Adaptive Research Station"
      description="Conducting adaptive research trials, technology validation, and demonstration of improved agricultural practices for local conditions."
      image="/images/adp.jpg.jpg"
      focalPerson={{
        name: "Dr. Saeed Ahmad",
        designation: "Station Director",
        phone: "+92-61-9210079",
        email: "saeed.ahmad@adp.gov.pk",
      }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adaptive Research</h3>
        <p className="text-muted-foreground">
          Field trials and technology validation for local agricultural conditions and farmer needs.
        </p>
      </Card>
    </DepartmentLayout>
  );
}
