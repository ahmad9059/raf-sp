import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { id: "pest" },
          { name: { contains: "Pesticide Quality Control Laboratory", mode: "insensitive" } },
        ],
      },
      include: {
        pesticideQCLabData: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Pesticide Quality Control Laboratory not found" },
        { status: 404 }
      );
    }

    const records = department.pesticideQCLabData;

    const buildings = records.filter((r) => r.type === "Building");
    const instruments = records.filter((r) => r.type === "Lab Equipment");
    const hrEntries = records.filter((r) => r.type === "Human Resource");

    const hrByRole = Object.values(
      hrEntries.reduce((acc, entry) => {
        const key = `${entry.name}-${entry.bpsScale || "bps"}`;
        const bucket = acc[key] || {
          name: entry.name,
          bps: entry.bpsScale || null,
          sanctioned: 0,
          filled: 0,
          vacant: 0,
        };

        const category = (entry.sectionCategory || entry.status || "").toLowerCase();
        if (category.includes("sanction")) bucket.sanctioned += entry.quantityOrSanctioned || 0;
        if (category.includes("filled")) bucket.filled += entry.quantityOrSanctioned || 0;
        if (category.includes("vacant")) bucket.vacant += entry.quantityOrSanctioned || 0;

        acc[key] = bucket;
        return acc;
      }, {} as Record<string, { name: string; bps: number | null; sanctioned: number; filled: number; vacant: number }>)
    );

    const totalSanctioned = hrByRole.reduce((sum, r) => sum + r.sanctioned, 0);
    const totalFilled = hrByRole.reduce((sum, r) => sum + r.filled, 0);
    const totalVacant = hrByRole.reduce((sum, r) => sum + r.vacant, 0);

    const totalInstruments = instruments.reduce((sum, item) => sum + (item.quantityOrSanctioned || 0), 0);

    const equipmentDistribution = instruments.map((item) => ({
      name: item.name,
      count: item.quantityOrSanctioned || 0,
    }));

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
      buildings,
      instruments,
      humanResources: hrByRole,
      stats: {
        totalBuildings: buildings.length,
        totalInstruments,
        totalSanctioned,
        totalFilled,
        totalVacant,
        equipmentDistribution,
      },
      notes: "Land resource: Nil. Farm machinery/equipment: Nil.",
      focalPersonDetail: {
        name: department.focalPerson || "Dr Subhan Danish",
        designation: department.designation || "Senior Scientist",
        contact: department.phone || "0304-7996951",
        email: department.email || "sd96850@gmail.com",
      },
    });
  } catch (error) {
    console.error("Error fetching Pesticide QC Lab data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pesticide QC lab data" },
      { status: 500 }
    );
  }
}
