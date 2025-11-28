"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createDepartment } from "@/actions/department";

const departmentsData = [
  {
    name: "Food Science and Technology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
    focalPerson: "Dr. Shabbir Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210071",
    email: "shabbir.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Agronomy Department",
    location: "MNS University of Agriculture, Multan",
    description:
      "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
    focalPerson: "Dr. Mahmood Alam",
    designation: "Professor",
    phone: "+92-61-9210072",
    email: "mahmood.alam@mnsuam.edu.pk",
  },
  {
    name: "Regional Agricultural Research Institute (RARI), Bahawalpur",
    location: "IUB - The Islamia University of Bahawalpur",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
  },
  {
    name: "Floriculture Research Sub-station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
  },
  {
    name: "Soil & Water Testing Laboratory",
    location: "MNS University of Agriculture, Multan",
    description:
      "Comprehensive soil and water analysis services for agricultural research and farmer support.",
    focalPerson: "Dr. Muhammad Tariq",
    designation: "Lab Director",
    phone: "+92-61-9210074",
    email: "tariq@mnsuam.edu.pk",
  },
  {
    name: "Entomology Research Sub-Station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on insect pests, beneficial insects, and integrated pest management strategies.",
    focalPerson: "Dr. Sohail Ahmad",
    designation: "Senior Entomologist",
    phone: "+92-61-9210075",
    email: "sohail.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    description:
      "Dedicated research facility for mango cultivation, varieties development, and post-harvest technologies.",
    focalPerson: "Dr. Muhammad Tauseef",
    designation: "Senior Scientist (Agronomy)",
    phone: "+923340072357",
    email: "tauseef@mri.gov.pk",
  },
  {
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    description:
      "Research and development in farm machinery, mechanization technologies, and agricultural engineering.",
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    phone: "+92-61-9210076",
    email: "khalid.mahmood@amri.gov.pk",
  },
  {
    name: "MNSUAM Estate & Facilities",
    location: "MNS University of Agriculture, Multan",
    description:
      "Management of university infrastructure, facilities, and estate operations.",
    focalPerson: "Engr. Ahmad Hassan",
    designation: "Estate Manager",
    phone: "+92-61-9210077",
    email: "ahmad.hassan@mnsuam.edu.pk",
  },
  {
    name: "Cotton Research Institute",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and education in cotton production, pest management, and fiber quality improvement.",
    focalPerson: "Dr. Rashid Ali Hassan",
    designation: "Professor",
    phone: "+92-61-9210078",
    email: "rashid.ali@mnsuam.edu.pk",
  },
];

export default function SeedDepartmentsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const handleSeedDepartments = async () => {
    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const dept of departmentsData) {
        try {
          const result = await createDepartment(dept);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Failed to create ${dept.name}:`, result.message);
          }
        } catch (err) {
          errorCount++;
          console.error(`Error creating ${dept.name}:`, err);
        }
      }

      if (successCount > 0) {
        success(`Successfully created ${successCount} departments!`);
      }
      if (errorCount > 0) {
        error(
          `Failed to create ${errorCount} departments. Check console for details.`
        );
      }
    } catch (err) {
      error("An error occurred while seeding departments");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Seed Departments
        </h1>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Create Departments</h2>
          <p className="text-gray-600 mb-6">
            This will create {departmentsData.length} departments in the
            database.
          </p>

          <Button
            onClick={handleSeedDepartments}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating Departments..." : "Create Departments"}
          </Button>
        </div>
      </div>
    </div>
  );
}
