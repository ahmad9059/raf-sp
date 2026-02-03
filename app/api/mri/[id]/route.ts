import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for MRI asset update
const mriAssetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  itemNameOrDesignation: z.string().optional().nullable(),
  bpsScale: z.number().int().optional().nullable(),
  totalQuantityOrPosts: z.number().int().optional().nullable(),
  filledOrFunctional: z.number().int().optional().nullable(),
  vacantOrNonFunctional: z.number().int().optional().nullable(),
  remarksOrLocation: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single MRI asset by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const asset = await prisma.mRIAssets.findUnique({
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
    console.error("Error fetching MRI asset:", error);
    return NextResponse.json({ error: "Failed to fetch MRI asset" }, { status: 500 });
  }
}

// PUT - Update an MRI asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return NextResponse.json({ error: "MRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.mRIAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = mriAssetUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.mRIAssets.update({
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
    console.error("Error updating MRI asset:", error);
    return NextResponse.json({ error: "Failed to update MRI asset" }, { status: 500 });
  }
}

// DELETE - Delete an MRI asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return NextResponse.json({ error: "MRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.mRIAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.mRIAssets.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting MRI asset:", error);
    return NextResponse.json({ error: "Failed to delete MRI asset" }, { status: 500 });
  }
}
