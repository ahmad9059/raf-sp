import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get CRI department
    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { name: { contains: "Cotton Research Institute", mode: "insensitive" } },
          { name: { contains: "CRI", mode: "insensitive" } },
        ],
      },
      include: {
        criMultanAssets: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Cotton Research Institute not found" },
        { status: 404 }
      );
    }

    // Separate lab equipment and farm machinery
    const labEquipment = department.criMultanAssets.filter(
      (asset) => asset.type === "Laboratory Equipment"
    );
    const farmMachinery = department.criMultanAssets.filter(
      (asset) => asset.type === "Farm Machinery"
    );

    // Calculate statistics
    const functionalLab = labEquipment.filter(
      (e) => e.operationalStatus === "Functional"
    ).length;
    const nonFunctionalLab = labEquipment.filter(
      (e) => e.operationalStatus === "Non-Functional"
    ).length;

    return NextResponse.json({
      department: {
        id: department.id,
        name: department.name,
        location: department.location,
        description: department.description,
        focalPerson: department.focalPerson,
        designation: department.designation,
        phone: department.phone,
        email: department.email,
      },
      labEquipment,
      farmMachinery,
      statistics: {
        totalLabEquipment: labEquipment.length,
        functionalLab,
        nonFunctionalLab,
        totalFarmMachinery: farmMachinery.length,
      },
    });
  } catch (error) {
    console.error("Error fetching CRI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
