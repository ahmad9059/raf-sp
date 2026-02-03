import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Soil Water Testing Project
const soilWaterProjectSchema = z.object({
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

// GET - Fetch all Soil Water Testing projects
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const projects = await prisma.soilWaterTestingProject.findMany({
      where: { departmentId: soilWaterDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching Soil Water projects:", error);
    return NextResponse.json({ error: "Failed to fetch Soil & Water projects" }, { status: 500 });
  }
}

// POST - Create a new Soil Water Testing project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = soilWaterProjectSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const project = await prisma.soilWaterTestingProject.create({
      data: {
        ...validatedFields.data,
        departmentId: soilWaterDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("Error creating Soil Water project:", error);
    return NextResponse.json({ error: "Failed to create Soil & Water project" }, { status: 500 });
  }
}
