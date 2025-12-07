import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get AMRI department
    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { name: { contains: "Agricultural Mechanization Research Institute", mode: "insensitive" } },
          { name: { contains: "AMRI", mode: "insensitive" } },
        ],
      },
      include: {
        amriInventory: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Agricultural Mechanization Research Institute not found" },
        { status: 404 }
      );
    }

    // Separate assets by type
    const infrastructure = department.amriInventory.filter(
      (asset) => asset.type === "Infrastructure" || asset.type === "Laboratory" || asset.type === "Facility"
    );
    
    const machinery = department.amriInventory.filter(
      (asset) => asset.type === "Machinery"
    );

    // Calculate statistics
    const totalMachinery = machinery.length;
    const functionalMachinery = machinery.filter(
      (m) => m.functionalStatus === "Functional"
    ).length;
    const nonFunctionalMachinery = machinery.filter(
      (m) => m.functionalStatus === "Non-Functional" || m.functionalStatus === "Not Functional need some repair"
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
      infrastructure,
      machinery,
      statistics: {
        totalMachinery,
        functionalMachinery,
        nonFunctionalMachinery,
      },
    });
  } catch (error) {
    console.error("Error fetching AMRI data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
