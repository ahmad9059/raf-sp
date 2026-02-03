import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Agricultural Extension Wing asset
const agriExtensionAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  areaSquareFeet: z.number().int().nullable().optional(),
  remarks: z.string().nullable().optional(),
  status: z.string().min(1, "Status is required"), // Utilized, Unused, etc.
  functionality: z.string().nullable().optional(),
  equipmentStatus: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
});

// GET - Fetch all Agricultural Extension Wing assets
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return NextResponse.json({ error: "Agricultural Extension Wing department not found" }, { status: 404 });
    }

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.agriculturalExtensionWing.findMany({
      where: { departmentId: agriExtDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching Agricultural Extension Wing assets:", error);
    return NextResponse.json({ error: "Failed to fetch Agricultural Extension Wing assets" }, { status: 500 });
  }
}

// POST - Create a new Agricultural Extension Wing asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return NextResponse.json({ error: "Agricultural Extension Wing department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedFields = agriExtensionAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.agriculturalExtensionWing.create({
      data: {
        ...validatedFields.data,
        departmentId: agriExtDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating Agricultural Extension Wing asset:", error);
    return NextResponse.json({ error: "Failed to create Agricultural Extension Wing asset" }, { status: 500 });
  }
}
