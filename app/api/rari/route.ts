import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for RARI asset
const rariAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  makeModelYear: z.string().optional().nullable(),
  quantity: z.number().int().optional().nullable(),
  conditionStatus: z.string().optional().nullable(),
  useApplication: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all RARI assets
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return NextResponse.json({ error: "RARI department not found" }, { status: 404 });
    }

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.rARIBahawalpurAssets.findMany({
      where: { departmentId: rariDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching RARI assets:", error);
    return NextResponse.json({ error: "Failed to fetch RARI assets" }, { status: 500 });
  }
}

// POST - Create a new RARI asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return NextResponse.json({ error: "RARI department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedFields = rariAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.rARIBahawalpurAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: rariDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating RARI asset:", error);
    return NextResponse.json({ error: "Failed to create RARI asset" }, { status: 500 });
  }
}
