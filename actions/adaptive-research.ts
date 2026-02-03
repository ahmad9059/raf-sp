"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ADAPTIVE_RESEARCH_DEPARTMENT_ID = "arc";
const DASHBOARD_PATH = "/dashboard/adaptive-research";

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

export type AdaptiveResearchPositionInput = z.infer<typeof adaptiveResearchPositionSchema>;

async function getAdaptiveResearchDepartment() {
  return prisma.department.findFirst({
    where: { id: ADAPTIVE_RESEARCH_DEPARTMENT_ID },
  });
}

/**
 * Get all Adaptive Research positions
 */
export async function getAdaptiveResearchPositions(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const department = await getAdaptiveResearchDepartment();

    if (!department) {
      return { success: false, message: "Adaptive Research department not found" };
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return { success: false, message: "Not authorized to view Adaptive Research data" };
    }

    const positions = await prisma.adaptiveResearchPosition.findMany({
      where: { departmentId: department.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: [{ orderNumber: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, data: positions };
  } catch (error) {
    console.error("Error fetching Adaptive Research positions:", error);
    return { success: false, message: "Failed to fetch Adaptive Research positions" };
  }
}

/**
 * Get a single Adaptive Research position by ID
 */
export async function getAdaptiveResearchPositionById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const position = await prisma.adaptiveResearchPosition.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!position) {
      return { success: false, message: "Position not found" };
    }

    return { success: true, data: position };
  } catch (error) {
    console.error("Error fetching Adaptive Research position:", error);
    return { success: false, message: "Failed to fetch Adaptive Research position" };
  }
}

/**
 * Create a new Adaptive Research position
 */
export async function createAdaptiveResearchPosition(
  data: AdaptiveResearchPositionInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;
    const department = await getAdaptiveResearchDepartment();

    if (!department) {
      return { success: false, message: "Adaptive Research department not found" };
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return { success: false, message: "Not authorized to create positions" };
    }

    const validatedFields = adaptiveResearchPositionSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const position = await prisma.adaptiveResearchPosition.create({
      data: {
        ...validatedFields.data,
        departmentId: department.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath(DASHBOARD_PATH);
    revalidatePath("/dashboard");

    return { success: true, message: "Position created successfully", data: position };
  } catch (error) {
    console.error("Error creating Adaptive Research position:", error);
    return { success: false, message: "Failed to create Adaptive Research position" };
  }
}

/**
 * Update an Adaptive Research position
 */
export async function updateAdaptiveResearchPosition(
  id: string,
  data: AdaptiveResearchPositionInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;
    const department = await getAdaptiveResearchDepartment();

    if (!department) {
      return { success: false, message: "Adaptive Research department not found" };
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return { success: false, message: "Not authorized to update positions" };
    }

    const existingPosition = await prisma.adaptiveResearchPosition.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return { success: false, message: "Position not found" };
    }

    const validatedFields = adaptiveResearchPositionSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const position = await prisma.adaptiveResearchPosition.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath(DASHBOARD_PATH);
    revalidatePath("/dashboard");

    return { success: true, message: "Position updated successfully", data: position };
  } catch (error) {
    console.error("Error updating Adaptive Research position:", error);
    return { success: false, message: "Failed to update Adaptive Research position" };
  }
}

/**
 * Delete an Adaptive Research position
 */
export async function deleteAdaptiveResearchPosition(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;
    const department = await getAdaptiveResearchDepartment();

    if (!department) {
      return { success: false, message: "Adaptive Research department not found" };
    }

    if (role === "DEPT_HEAD" && departmentId !== department.id) {
      return { success: false, message: "Not authorized to delete positions" };
    }

    const existingPosition = await prisma.adaptiveResearchPosition.findUnique({
      where: { id },
    });

    if (!existingPosition) {
      return { success: false, message: "Position not found" };
    }

    await prisma.adaptiveResearchPosition.delete({
      where: { id },
    });

    revalidatePath(DASHBOARD_PATH);
    revalidatePath("/dashboard");

    return { success: true, message: "Position deleted successfully" };
  } catch (error) {
    console.error("Error deleting Adaptive Research position:", error);
    return { success: false, message: "Failed to delete Adaptive Research position" };
  }
}
