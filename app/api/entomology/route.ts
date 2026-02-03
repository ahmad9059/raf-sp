import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for ERSS Stock Register item
const erssStockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantityStr: z.string().optional().nullable(),
  dateReceived: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  lastVerificationDate: z.string().optional().nullable(),
  currentStatusRemarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

// GET - Fetch all ERSS stock items
export async function GET() {
  try {
    const session = await auth();

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

    // Check authorization for DEPT_HEAD
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const items = await prisma.eRSSStockRegister.findMany({
      where: { departmentId: erssDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching ERSS stock items:", error);
    return NextResponse.json({ error: "Failed to fetch ERSS stock items" }, { status: 500 });
  }
}

// POST - Create a new ERSS stock item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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

    const body = await request.json();
    const validatedFields = erssStockSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const item = await prisma.eRSSStockRegister.create({
      data: {
        ...validatedFields.data,
        departmentId: erssDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Error creating ERSS stock item:", error);
    return NextResponse.json({ error: "Failed to create ERSS stock item" }, { status: 500 });
  }
}
