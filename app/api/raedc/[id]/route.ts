import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for RAEDC equipment update
const raedcEquipmentUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  facilityType: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  location: z.string().optional().nullable(),
  functionality: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single RAEDC equipment by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipment = await prisma.rAEDCEquipment.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: equipment });
  } catch (error) {
    console.error("Error fetching RAEDC equipment:", error);
    return NextResponse.json({ error: "Failed to fetch RAEDC equipment" }, { status: 500 });
  }
}

// PUT - Update a RAEDC equipment
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return NextResponse.json({ error: "RAEDC department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if equipment exists
    const existingEquipment = await prisma.rAEDCEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = raedcEquipmentUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const equipment = await prisma.rAEDCEquipment.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: equipment });
  } catch (error) {
    console.error("Error updating RAEDC equipment:", error);
    return NextResponse.json({ error: "Failed to update RAEDC equipment" }, { status: 500 });
  }
}

// DELETE - Delete a RAEDC equipment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return NextResponse.json({ error: "RAEDC department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if equipment exists
    const existingEquipment = await prisma.rAEDCEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    await prisma.rAEDCEquipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting RAEDC equipment:", error);
    return NextResponse.json({ error: "Failed to delete RAEDC equipment" }, { status: 500 });
  }
}
