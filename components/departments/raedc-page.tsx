"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";

export function RAEDCPage() {
  return (
    <DepartmentLayout
      name="Regional Agricultural Economic Development Centre"
      description="Economic research, development planning, and capacity building for agricultural sector growth and farmer prosperity."
      image="/images/raedc.jpg.jpg"
      focalPerson={{
        name: "Dr. Zahid Hussain",
        designation: "Director",
        phone: "+92-61-9210085",
        email: "zahid@raedc.gov.pk",
      }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Economic Development</h3>
        <p className="text-muted-foreground">
          Agricultural economic research, policy analysis, and development planning for regional agricultural growth.
        </p>
      </Card>
    </DepartmentLayout>
  );
}
