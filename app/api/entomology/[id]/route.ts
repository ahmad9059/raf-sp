import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for ERSS Stock Register item update
const erssStockUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantityStr: z.string().optional().nullable(),
  dateReceived: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  lastVerificationDate: z.string().optional().nullable(),
  currentStatusRemarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single ERSS stock item by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await prisma.eRSSStockRegister.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Stock item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching ERSS stock item:", error);
    return NextResponse.json({ error: "Failed to fetch ERSS stock item" }, { status: 500 });
  }
}

// PUT - Update an ERSS stock item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return NextResponse.json({ error: "Entomology Research Sub-Station department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if item exists
    const existingItem = await prisma.eRSSStockRegister.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Stock item not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedFields = erssStockUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const item = await prisma.eRSSStockRegister.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error updating ERSS stock item:", error);
    return NextResponse.json({ error: "Failed to update ERSS stock item" }, { status: 500 });
  }
}

// DELETE - Delete an ERSS stock item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return NextResponse.json({ error: "Entomology Research Sub-Station department not found" }, { status: 404 });
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if item exists
    const existingItem = await prisma.eRSSStockRegister.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Stock item not found" }, { status: 404 });
    }

    await prisma.eRSSStockRegister.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Stock item deleted successfully" });
  } catch (error) {
    console.error("Error deleting ERSS stock item:", error);
    return NextResponse.json({ error: "Failed to delete ERSS stock item" }, { status: 500 });
  }
}
