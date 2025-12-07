import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "mri" },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const assets = await prisma.mRIAssets.findMany({
      where: { departmentId: "mri" },
    });

    // Categorize data
    const landData = assets.filter((item) => item.category === "Land");
    const buildingData = assets.filter((item) => item.category === "Building");
    const farmMachinery = assets.filter((item) => item.category === "Farm Machinery");
    const labEquipment = assets.filter((item) => item.category === "Lab Equipment");
    const hrData = assets.filter((item) => item.category === "Human Resources");

    // Calculate statistics
    const totalPosts = hrData.reduce((sum, item) => sum + (item.totalQuantityOrPosts || 0), 0);
    const filledPosts = hrData.reduce((sum, item) => sum + (item.filledOrFunctional || 0), 0);
    const vacantPosts = hrData.reduce((sum, item) => sum + (item.vacantOrNonFunctional || 0), 0);

    return NextResponse.json({
      department,
      landData,
      buildingData,
      farmMachinery,
      labEquipment,
      hrData,
      statistics: {
        totalPosts,
        filledPosts,
        vacantPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching MRI data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
