import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for AMRI asset
const amriAssetSchema = z.object({
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

// GET - Fetch all AMRI assets
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.aMRIInventory.findMany({
      where: { departmentId: amriDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching AMRI assets:", error);
    return NextResponse.json({ error: "Failed to fetch AMRI assets" }, { status: 500 });
  }
}

// POST - Create a new AMRI asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = amriAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.aMRIInventory.create({
      data: {
        ...validatedFields.data,
        departmentId: amriDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating AMRI asset:", error);
    return NextResponse.json({ error: "Failed to create AMRI asset" }, { status: 500 });
  }
}
