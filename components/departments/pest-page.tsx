"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";

export function PestPage() {
  return (
    <DepartmentLayout
      name="Pesticide Quality Control Laboratory"
      description="Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals."
      image="/images/lab.jpg.jpg"
      focalPerson={{
        name: "Dr. Muhammad Asif",
        designation: "Chief Scientist",
        phone: "+92-61-9210078",
        email: "asif@pesticidelab.gov.pk",
      }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quality Control Services</h3>
        <p className="text-muted-foreground">
          Comprehensive pesticide testing and quality assurance services ensuring agricultural chemical safety and efficacy.
        </p>
      </Card>
    </DepartmentLayout>
  );
}
