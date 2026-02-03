import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Food Science equipment update
const foodScienceEquipmentUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  labSectionName: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  focalPerson: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single Food Science equipment by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipment = await prisma.foodAnalysisLabEquipment.findUnique({
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
    console.error("Error fetching Food Science equipment:", error);
    return NextResponse.json({ error: "Failed to fetch Food Science equipment" }, { status: 500 });
  }
}

// PUT - Update a Food Science equipment
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Food Science department
    const foodScienceDepartment = await prisma.department.findFirst({
      where: { id: "food-science" },
    });

    if (!foodScienceDepartment) {
      return NextResponse.json({ error: "Food Science department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if equipment exists
    const existingEquipment = await prisma.foodAnalysisLabEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = foodScienceEquipmentUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const equipment = await prisma.foodAnalysisLabEquipment.update({
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
    console.error("Error updating Food Science equipment:", error);
    return NextResponse.json({ error: "Failed to update Food Science equipment" }, { status: 500 });
  }
}

// DELETE - Delete a Food Science equipment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Food Science department
    const foodScienceDepartment = await prisma.department.findFirst({
      where: { id: "food-science" },
    });

    if (!foodScienceDepartment) {
      return NextResponse.json({ error: "Food Science department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if equipment exists
    const existingEquipment = await prisma.foodAnalysisLabEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    await prisma.foodAnalysisLabEquipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting Food Science equipment:", error);
    return NextResponse.json({ error: "Failed to delete Food Science equipment" }, { status: 500 });
  }
}
