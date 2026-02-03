import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for CRI asset
const criAssetSchema = z.object({
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

// GET - Fetch all CRI assets
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const assets = await prisma.cRIMultanAssets.findMany({
      where: { departmentId: criDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching CRI assets:", error);
    return NextResponse.json({ error: "Failed to fetch CRI assets" }, { status: 500 });
  }
}

// POST - Create a new CRI asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = criAssetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.cRIMultanAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: criDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating CRI asset:", error);
    return NextResponse.json({ error: "Failed to create CRI asset" }, { status: 500 });
  }
}
