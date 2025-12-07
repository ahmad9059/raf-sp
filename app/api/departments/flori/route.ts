import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "flori" },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const assets = await prisma.floricultureStationAssets.findMany({
      where: { departmentId: "flori" },
    });

    // Categorize data
    const landData = assets.filter((item) => item.category === "Land");
    const buildingData = assets.filter((item) => item.category === "Building");
    const farmMachinery = assets.filter((item) => item.category === "Farm Machinery");
    const labEquipment = assets.filter((item) => item.category === "Lab Equipment");
    const hrData = assets.filter((item) => item.category === "Human Resources");

    // Calculate statistics
    const totalStaff = hrData.reduce((sum, item) => sum + (item.sanctionedQty || 0), 0);
    const totalVacant = hrData.reduce((sum, item) => sum + ((item.sanctionedQty || 0) - (item.inPositionQty || 0)), 0);
    const totalMachinery = farmMachinery.length + labEquipment.length;

    return NextResponse.json({
      department,
      landData,
      buildingData,
      farmMachinery,
      labEquipment,
      hrData,
      statistics: {
        totalStaff,
        totalVacant,
        totalMachinery,
      },
    });
  } catch (error) {
    console.error("Error fetching Floriculture data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
