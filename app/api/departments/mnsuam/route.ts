import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "mnsuam" },
      include: {
        mnsuamEstateFacilities: {
          orderBy: { blockName: "asc" },
        },
        agronomyLabEquipment: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "MNSUAM department not found" },
        { status: 404 }
      );
    }

    const facilities = department.mnsuamEstateFacilities;
    const equipment = department.agronomyLabEquipment;

    const totalCapacity = facilities.reduce(
      (sum, item) => sum + (item.capacityPersons || 0),
      0
    );

    const blockSummary = Object.values(
      facilities.reduce((acc, item) => {
        const key = item.blockName || "Other";
        if (!acc[key]) {
          acc[key] = { blockName: key, rooms: 0, capacity: 0 };
        }
        acc[key].rooms += 1;
        acc[key].capacity += item.capacityPersons || 0;
        return acc;
      }, {} as Record<string, { blockName: string; rooms: number; capacity: number }>)
    );

    const totalUnits = equipment.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    const equipmentByType = Object.values(
      equipment.reduce((acc, item) => {
        const key = item.type || "Other";
        if (!acc[key]) {
          acc[key] = { type: key, count: 0 };
        }
        acc[key].count += item.quantity || 0;
        return acc;
      }, {} as Record<string, { type: string; count: number }>)
    );

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
      facilities,
      agronomyEquipment: equipment,
      stats: {
        totalFacilities: facilities.length,
        totalCapacity,
        blockSummary,
        equipmentSummary: {
          totalTypes: equipment.length,
          totalUnits,
          equipmentByType,
        },
      },
      focalPersons: [
        {
          name: "Dr. Mahmood Alam",
          role: "Directorate of University Farms",
          email: "mahmood.alam@mnsuam.edu.pk",
        },
        {
          name: "Dr. Nabeel Ahmad Ikram",
          role: "Agronomy Department",
          email: "nabeel.ahmad@mnsuam.edu.pk",
        },
      ],
      notes:
        "All halls and meeting rooms are fully air conditioned and connected with back-up power supply.",
    });
  } catch (error) {
    console.error("Error fetching MNSUAM data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MNSUAM data" },
      { status: 500 }
    );
  }
}
