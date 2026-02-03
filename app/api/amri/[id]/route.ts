import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for AMRI asset update
const amriAssetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  assetCategory: z.string().optional().nullable(),
  itemDescription: z.string().optional().nullable(),
  quantityOrArea: z.string().optional().nullable(),
  functionalStatus: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single AMRI asset by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const asset = await prisma.aMRIInventory.findUnique({
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
    console.error("Error fetching AMRI asset:", error);
    return NextResponse.json({ error: "Failed to fetch AMRI asset" }, { status: 500 });
  }
}

// PUT - Update an AMRI asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return NextResponse.json({ error: "AMRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.aMRIInventory.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = amriAssetUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.aMRIInventory.update({
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
    console.error("Error updating AMRI asset:", error);
    return NextResponse.json({ error: "Failed to update AMRI asset" }, { status: 500 });
  }
}

// DELETE - Delete an AMRI asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return NextResponse.json({ error: "AMRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.aMRIInventory.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.aMRIInventory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting AMRI asset:", error);
    return NextResponse.json({ error: "Failed to delete AMRI asset" }, { status: 500 });
  }
}
