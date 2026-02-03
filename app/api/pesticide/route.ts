import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Pesticide QC Lab Data
const pesticideDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  sectionCategory: z.string().optional().nullable(),
  bpsScale: z.number().int().optional().nullable(),
  quantityOrSanctioned: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all Pesticide QC Lab data
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return NextResponse.json({ error: "Pesticide QC Lab department not found" }, { status: 404 });
    }

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const data = await prisma.pesticideQCLabData.findMany({
      where: { departmentId: pesticideDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching Pesticide QC Lab data:", error);
    return NextResponse.json({ error: "Failed to fetch Pesticide QC Lab data" }, { status: 500 });
  }
}

// POST - Create a new Pesticide QC Lab record
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return NextResponse.json({ error: "Pesticide QC Lab department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedFields = pesticideDataSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const record = await prisma.pesticideQCLabData.create({
      data: {
        ...validatedFields.data,
        departmentId: pesticideDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("Error creating Pesticide QC Lab record:", error);
    return NextResponse.json({ error: "Failed to create Pesticide QC Lab record" }, { status: 500 });
  }
}
