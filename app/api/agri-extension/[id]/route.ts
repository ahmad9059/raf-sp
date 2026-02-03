import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Agricultural Extension Wing asset update
const agriExtensionAssetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  areaSquareFeet: z.number().int().nullable().optional(),
  remarks: z.string().nullable().optional(),
  status: z.string().min(1, "Status is required"), // Utilized, Unused, etc.
  functionality: z.string().nullable().optional(),
  equipmentStatus: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single Agricultural Extension Wing asset by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const asset = await prisma.agriculturalExtensionWing.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error("Error fetching Agricultural Extension Wing asset:", error);
    return NextResponse.json({ error: "Failed to fetch Agricultural Extension Wing asset" }, { status: 500 });
  }
}

// PUT - Update an Agricultural Extension Wing asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if asset exists
    const existingAsset = await prisma.agriculturalExtensionWing.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = agriExtensionAssetUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.agriculturalExtensionWing.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error("Error updating Agricultural Extension Wing asset:", error);
    return NextResponse.json({ error: "Failed to update Agricultural Extension Wing asset" }, { status: 500 });
  }
}

// DELETE - Delete an Agricultural Extension Wing asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if asset exists
    const existingAsset = await prisma.agriculturalExtensionWing.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.agriculturalExtensionWing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting Agricultural Extension Wing asset:", error);
    return NextResponse.json({ error: "Failed to delete Agricultural Extension Wing asset" }, { status: 500 });
  }
}
