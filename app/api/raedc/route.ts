import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for RAEDC equipment
const raedcEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  facilityType: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  location: z.string().optional().nullable(),
  functionality: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all RAEDC equipment
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const equipment = await prisma.rAEDCEquipment.findMany({
      where: { departmentId: raedcDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: equipment });
  } catch (error) {
    console.error("Error fetching RAEDC equipment:", error);
    return NextResponse.json({ error: "Failed to fetch RAEDC equipment" }, { status: 500 });
  }
}

// POST - Create a new RAEDC equipment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = raedcEquipmentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const equipment = await prisma.rAEDCEquipment.create({
      data: {
        ...validatedFields.data,
        departmentId: raedcDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: equipment }, { status: 201 });
  } catch (error) {
    console.error("Error creating RAEDC equipment:", error);
    return NextResponse.json({ error: "Failed to create RAEDC equipment" }, { status: 500 });
  }
}
