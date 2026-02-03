import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for CRI asset update
const criAssetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  imageUrl: z.string().optional().nullable(),
  makeModel: z.string().optional().nullable(),
  labDepartment: z.string().optional().nullable(),
  purposeFunction: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  quantity: z.number().int().default(1),
  operationalStatus: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single CRI asset by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const asset = await prisma.cRIMultanAssets.findUnique({
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
    console.error("Error fetching CRI asset:", error);
    return NextResponse.json({ error: "Failed to fetch CRI asset" }, { status: 500 });
  }
}

// PUT - Update a CRI asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return NextResponse.json({ error: "CRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.cRIMultanAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = criAssetUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.cRIMultanAssets.update({
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
    console.error("Error updating CRI asset:", error);
    return NextResponse.json({ error: "Failed to update CRI asset" }, { status: 500 });
  }
}

// DELETE - Delete a CRI asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return NextResponse.json({ error: "CRI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if asset exists
    const existingAsset = await prisma.cRIMultanAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.cRIMultanAssets.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting CRI asset:", error);
    return NextResponse.json({ error: "Failed to delete CRI asset" }, { status: 500 });
  }
}
