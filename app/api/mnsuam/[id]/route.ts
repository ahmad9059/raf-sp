import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for MNSUAM facility update
const mnsuamFacilityUpdateSchema = z.object({
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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single MNSUAM facility by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: facility });
  } catch (error) {
    console.error("Error fetching MNSUAM facility:", error);
    return NextResponse.json({ error: "Failed to fetch MNSUAM facility" }, { status: 500 });
  }
}

// PUT - Update an MNSUAM facility
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if facility exists
    const existingFacility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = mnsuamFacilityUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const facility = await prisma.mNSUAMEstateFacilities.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: facility });
  } catch (error) {
    console.error("Error updating MNSUAM facility:", error);
    return NextResponse.json({ error: "Failed to update MNSUAM facility" }, { status: 500 });
  }
}

// DELETE - Delete an MNSUAM facility
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if facility exists
    const existingFacility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    await prisma.mNSUAMEstateFacilities.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Error deleting MNSUAM facility:", error);
    return NextResponse.json({ error: "Failed to delete MNSUAM facility" }, { status: 500 });
  }
}
