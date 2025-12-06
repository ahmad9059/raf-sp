"use client";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MNSUAMPage() {
  return (
    <DepartmentLayout
      name="MNS University of Agriculture"
      description="Leading agricultural university with state-of-the-art laboratories, research facilities, and comprehensive equipment for agricultural education and research."
      image="/images/mns.png.jpg"
      focalPerson={{
        name: "Dr. Muhammad Asif",
        designation: "Director",
        phone: "+92-61-9210071",
        email: "info@mnsuam.edu.pk",
      }}
    >
      <Tabs defaultValue="labs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="labs">Laboratories</TabsTrigger>
          <TabsTrigger value="agronomy">Agronomy</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="labs" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Laboratory Overview</h3>
            <p className="text-muted-foreground">
              Comprehensive laboratory facilities with modern equipment for agricultural research and education.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="agronomy" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agronomy Department</h3>
            <p className="text-muted-foreground">
              Advanced equipment and facilities for crop science research and practical training.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">University Facilities</h3>
            <p className="text-muted-foreground">
              Modern infrastructure supporting research, education, and agricultural development.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </DepartmentLayout>
  );
}
