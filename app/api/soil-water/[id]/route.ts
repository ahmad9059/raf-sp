import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Soil Water Testing Project update
const soilWaterProjectUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  bps: z.number().int().optional().nullable(),
  quantityRequired: z.number().int().optional().nullable(),
  budgetAllocationTotalMillion: z.number().optional().nullable(),
  justificationOrYear: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single Soil Water Testing project by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching Soil Water project:", error);
    return NextResponse.json({ error: "Failed to fetch Soil & Water project" }, { status: 500 });
  }
}

// PUT - Update a Soil Water Testing project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return NextResponse.json({ error: "Soil & Water Testing Laboratory department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if project exists
    const existingProject = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = soilWaterProjectUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const project = await prisma.soilWaterTestingProject.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating Soil Water project:", error);
    return NextResponse.json({ error: "Failed to update Soil & Water project" }, { status: 500 });
  }
}

// DELETE - Delete a Soil Water Testing project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return NextResponse.json({ error: "Soil & Water Testing Laboratory department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if project exists
    const existingProject = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.soilWaterTestingProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting Soil Water project:", error);
    return NextResponse.json({ error: "Failed to delete Soil & Water project" }, { status: 500 });
  }
}
