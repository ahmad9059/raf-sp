import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ADAPTIVE_RESEARCH_DEPARTMENT_ID = "arc";

const adaptiveResearchPositionSchema = z.object({
  attachedDepartment: z.string().optional().nullable(),
  postName: z.string().min(1, "Post name is required"),
  bpsScale: z.string().min(1, "BPS scale is required"),
  sanctionedPosts: z.number().int().nonnegative(),
  filledPosts: z.number().int().nonnegative(),
  vacantPosts: z.number().int().nonnegative(),
  promotionPosts: z.number().int().nonnegative(),
  initialRecruitmentPosts: z.number().int().nonnegative(),
  remarks: z.string().optional().nullable(),
  orderNumber: z.number().int().nonnegative().optional().nullable(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    const department = await prisma.department.findFirst({
      where: { id: ADAPTIVE_RESEARCH_DEPARTMENT_ID },
    });

    if (!department) {
      return NextResponse.json({ error: "Adaptive Research department not found" }, { status: 404 });
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const positions = await prisma.adaptiveResearchPosition.findMany({
      where: { departmentId: department.id },
      include: {
        department: { select: { name: true } },
      },
      orderBy: [{ orderNumber: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: positions });
  } catch (error) {
    console.error("Error fetching Adaptive Research positions:", error);
    return NextResponse.json({ error: "Failed to fetch Adaptive Research positions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, departmentId } = session.user;

    const department = await prisma.department.findFirst({
      where: { id: ADAPTIVE_RESEARCH_DEPARTMENT_ID },
    });

    if (!department) {
      return NextResponse.json({ error: "Adaptive Research department not found" }, { status: 404 });
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedFields = adaptiveResearchPositionSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const position = await prisma.adaptiveResearchPosition.create({
      data: {
        ...validatedFields.data,
        departmentId: department.id,
      },
      include: {
        department: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, data: position }, { status: 201 });
  } catch (error) {
    console.error("Error creating Adaptive Research position:", error);
    return NextResponse.json({ error: "Failed to create Adaptive Research position" }, { status: 500 });
  }
}
