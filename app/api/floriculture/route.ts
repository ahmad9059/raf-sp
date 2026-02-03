import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Floriculture asset
const floricultureAssetSchema = z.object({
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

// GET - Fetch all Floriculture assets
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.floricultureStationAssets.findMany({
      where: { departmentId: floricultureDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching Floriculture assets:", error);
    return NextResponse.json({ error: "Failed to fetch Floriculture assets" }, { status: 500 });
  }
}

// POST - Create a new Floriculture asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = floricultureAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.floricultureStationAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: floricultureDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating Floriculture asset:", error);
    return NextResponse.json({ error: "Failed to create Floriculture asset" }, { status: 500 });
  }
}
