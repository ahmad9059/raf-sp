import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for Pesticide QC Lab Data update
const pesticideDataUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  sectionCategory: z.string().optional().nullable(),
  bpsScale: z.number().int().optional().nullable(),
  quantityOrSanctioned: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single Pesticide QC Lab record by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await prisma.pesticideQCLabData.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Error fetching Pesticide QC Lab record:", error);
    return NextResponse.json({ error: "Failed to fetch Pesticide QC Lab record" }, { status: 500 });
  }
}

// PUT - Update a Pesticide QC Lab record
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if record exists
    const existingRecord = await prisma.pesticideQCLabData.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = pesticideDataUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const record = await prisma.pesticideQCLabData.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Error updating Pesticide QC Lab record:", error);
    return NextResponse.json({ error: "Failed to update Pesticide QC Lab record" }, { status: 500 });
  }
}

// DELETE - Delete a Pesticide QC Lab record
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    // Check if record exists
    const existingRecord = await prisma.pesticideQCLabData.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await prisma.pesticideQCLabData.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting Pesticide QC Lab record:", error);
    return NextResponse.json({ error: "Failed to delete Pesticide QC Lab record" }, { status: 500 });
  }
}
