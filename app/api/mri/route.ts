import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for MRI asset
const mriAssetSchema = z.object({
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

// GET - Fetch all MRI assets
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.mRIAssets.findMany({
      where: { departmentId: mriDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching MRI assets:", error);
    return NextResponse.json({ error: "Failed to fetch MRI assets" }, { status: 500 });
  }
}

// POST - Create a new MRI asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = mriAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.mRIAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: mriDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating MRI asset:", error);
    return NextResponse.json({ error: "Failed to create MRI asset" }, { status: 500 });
  }
}
