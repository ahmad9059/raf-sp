import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for MNSUAM facility
const mnsuamFacilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  blockName: z.string().optional().nullable(),
  facilityType: z.string().optional().nullable(),
  capacityPersons: z.number().int().optional().nullable(),
  capacityLabel: z.string().optional().nullable(),
  displayOrder: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all MNSUAM facilities
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return NextResponse.json({ error: "MNSUAM department not found" }, { status: 404 });
    }

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const facilities = await prisma.mNSUAMEstateFacilities.findMany({
      where: { departmentId: mnsuamDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: facilities });
  } catch (error) {
    console.error("Error fetching MNSUAM facilities:", error);
    return NextResponse.json({ error: "Failed to fetch MNSUAM facilities" }, { status: 500 });
  }
}

// POST - Create a new MNSUAM facility
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return NextResponse.json({ error: "MNSUAM department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedFields = mnsuamFacilitySchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const facility = await prisma.mNSUAMEstateFacilities.create({
      data: {
        ...validatedFields.data,
        departmentId: mnsuamDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: facility }, { status: 201 });
  } catch (error) {
    console.error("Error creating MNSUAM facility:", error);
    return NextResponse.json({ error: "Failed to create MNSUAM facility" }, { status: 500 });
  }
}
