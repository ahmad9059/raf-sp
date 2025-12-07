
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "rari" },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const assets = await prisma.rARIBahawalpurAssets.findMany({
      where: { departmentId: "rari" },
    });

    // Categorize data
    const landData = assets.filter((item) => item.type === "Land");
    const buildingData = assets.filter((item) => item.type === "Building");
    const farmMachinery = assets.filter((item) => item.type === "Farm Machinery");
    const labEquipment = assets.filter((item) => item.type === "Lab Equipment");
    const hrOfficers = assets.filter((item) => item.type === "HR - Officers");
    const hrOfficials = assets.filter((item) => item.type === "HR - Officials");

    // Calculate statistics
    const totalLandArea = landData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalBuildings = buildingData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalMachinery = farmMachinery.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalLabEquipment = labEquipment.length; // Count of items
    
    const totalOfficers = hrOfficers.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalOfficials = hrOfficials.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalHR = totalOfficers + totalOfficials;

    return NextResponse.json({
      department,
      landData,
      buildingData,
      farmMachinery,
      labEquipment,
      hrOfficers,
      hrOfficials,
      statistics: {
        totalLandArea,
        totalBuildings,
        totalMachinery,
        totalLabEquipment,
        totalHR,
        totalOfficers,
        totalOfficials,
      },
    });
  } catch (error) {
    console.error("Error fetching RARI data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
