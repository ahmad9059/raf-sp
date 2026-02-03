import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Floriculture asset update
const floricultureAssetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  itemNameOrPost: z.string().optional().nullable(),
  bpsScale: z.string().optional().nullable(),
  sanctionedQty: z.number().int().optional().nullable(),
  inPositionQty: z.number().int().optional().nullable(),
  detailsOrArea: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single Floriculture asset by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const asset = await prisma.floricultureStationAssets.findUnique({
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
    console.error("Error fetching Floriculture asset:", error);
    return NextResponse.json({ error: "Failed to fetch Floriculture asset" }, { status: 500 });
  }
}

// PUT - Update a Floriculture asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return NextResponse.json({ error: "Floriculture department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.floricultureStationAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = floricultureAssetUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.floricultureStationAssets.update({
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
    console.error("Error updating Floriculture asset:", error);
    return NextResponse.json({ error: "Failed to update Floriculture asset" }, { status: 500 });
  }
}

// DELETE - Delete a Floriculture asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return NextResponse.json({ error: "Floriculture department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.floricultureStationAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.floricultureStationAssets.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting Floriculture asset:", error);
    return NextResponse.json({ error: "Failed to delete Floriculture asset" }, { status: 500 });
  }
}
