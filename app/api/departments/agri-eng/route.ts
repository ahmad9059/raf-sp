
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get Agricultural Engineering department
    const department = await prisma.department.findFirst({
      where: {
        name: { contains: "Agriculture Engineering", mode: "insensitive" },
      },
      include: {
        agriEngineeringMultanRegionData: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Agricultural Engineering Department not found" },
        { status: 404 }
      );
    }

    const data = department.agriEngineeringMultanRegionData;

    // Group data
    const buildingDetails = data.filter((item) => item.type === "Building Details");
    
    const farmMachineryRaw = data.filter((item) => item.type === "Farm Machinery");
    const farmMachinery = {
      bulldozers: farmMachineryRaw.filter((item) => item.category === "Bulldozers"),
      handBoringPlants: farmMachineryRaw.filter((item) => item.category === "Hand Boring Plants"),
      powerDrillingRigs: farmMachineryRaw.filter((item) => item.category === "Power Drilling Rigs"),
      electricResistivityMeters: farmMachineryRaw.filter((item) => item.category === "Electric Resistivity Meters"),
    };

    const humanResources = data.filter((item) => item.type === "Human Resources");

    // Calculate statistics
    const totalBuildings = buildingDetails.length;
    const totalMachinery = farmMachineryRaw.length;
    const totalHR = humanResources.reduce((acc, curr) => {
        const count = parseInt(curr.quantityOrArea || "0");
        return acc + (isNaN(count) ? 0 : count);
    }, 0);

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
      buildingDetails,
      farmMachinery,
      humanResources,
      statistics: {
        totalBuildings,
        totalMachinery,
        totalHR,
      },
    });
  } catch (error) {
    console.error("Error fetching Agricultural Engineering data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
