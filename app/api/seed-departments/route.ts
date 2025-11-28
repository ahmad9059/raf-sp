import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const departments = [
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

export async function POST() {
  try {
    console.log("Seeding departments...");

    const results = [];
    for (const dept of departments) {
      const existingDept = await prisma.department.findUnique({
        where: { name: dept.name },
      });

      if (!existingDept) {
        const created = await prisma.department.create({
          data: dept,
        });
        results.push({ action: "created", department: created.name });
        console.log(`Created department: ${dept.name}`);
      } else {
        const updated = await prisma.department.update({
          where: { name: dept.name },
          data: dept,
        });
        results.push({ action: "updated", department: updated.name });
        console.log(`Updated department: ${dept.name}`);
      }
    }

    console.log("Seeding completed!");

    return NextResponse.json({
      success: true,
      message: "Departments seeded successfully",
      results,
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
