import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";

export async function POST() {
  try {
    console.log("Seeding equipment data...");

    // Get Food Science department
    const foodScienceDept = await prisma.department.findUnique({
      where: { name: "Food Science and Technology" },
    });

    if (!foodScienceDept) {
      return NextResponse.json({
        success: false,
        error: "Food Science department not found",
      });
    }

    // Sample equipment data based on your screenshot
    const equipmentData = [
      {
        name: "Kjeldahl Apparatus (Digestion and Distillation)",
        type: "Analysis",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Analysis",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Water Activity meter",
        type: "Analysis",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Analysis",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Soxhlet Apparatus",
        type: "Analysis",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Analysis",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Analytical Weighing Balance",
        type: "Measurement",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Measurement",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Autoclave",
        type: "Sterilization",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Sterilization",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Texture Analyser",
        type: "Analysis",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Analysis",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Freeze Dryer",
        type: "Processing",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Processing",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Pulse Electric Field",
        type: "Processing",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Processing",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Ozonation chamber",
        type: "Processing",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Processing",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Pasteurizer",
        type: "Processing",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Processing",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
      {
        name: "Fermenter",
        type: "Processing",
        status: EquipmentStatus.AVAILABLE,
        departmentId: foodScienceDept.id,
        labSectionName: "Processing",
        quantity: 1,
        focalPerson: "Dr. Shabbir Ahmad",
      },
    ];

    const results = [];
    for (const equipment of equipmentData) {
      const existing = await prisma.foodAnalysisLabEquipment.findFirst({
        where: {
          name: equipment.name,
          departmentId: equipment.departmentId,
        },
      });

      if (!existing) {
        const created = await prisma.foodAnalysisLabEquipment.create({
          data: equipment,
        });
        results.push({ action: "created", equipment: created.name });
        console.log(`Created equipment: ${equipment.name}`);
      } else {
        results.push({ action: "exists", equipment: equipment.name });
        console.log(`Equipment already exists: ${equipment.name}`);
      }
    }

    console.log("Equipment seeding completed!");

    return NextResponse.json({
      success: true,
      message: "Equipment seeded successfully",
      departmentId: foodScienceDept.id,
      results,
    });
  } catch (error) {
    console.error("Equipment seeding failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
