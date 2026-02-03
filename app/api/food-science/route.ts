import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Food Science equipment
const foodScienceEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  labSectionName: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  focalPerson: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all Food Science equipment
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const equipment = await prisma.foodAnalysisLabEquipment.findMany({
      where: { departmentId: foodScienceDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: equipment });
  } catch (error) {
    console.error("Error fetching Food Science equipment:", error);
    return NextResponse.json({ error: "Failed to fetch Food Science equipment" }, { status: 500 });
  }
}

// POST - Create a new Food Science equipment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = foodScienceEquipmentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const equipment = await prisma.foodAnalysisLabEquipment.create({
      data: {
        ...validatedFields.data,
        departmentId: foodScienceDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: equipment }, { status: 201 });
  } catch (error) {
    console.error("Error creating Food Science equipment:", error);
    return NextResponse.json({ error: "Failed to create Food Science equipment" }, { status: 500 });
  }
}
