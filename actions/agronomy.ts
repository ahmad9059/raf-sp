"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AGRONOMY_DEPARTMENT_ID = "agronomy";
const DASHBOARD_PATH = "/dashboard/agronomy";

// Validation schema for Agronomy equipment
const agronomyEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantity: z.number().int().min(1).default(1),
  focalPerson1: z.string().optional().nullable(),
  displayOrder: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type AgronomyEquipmentInput = z.infer<typeof agronomyEquipmentSchema>;

async function getAgronomyDepartment() {
  return prisma.department.findFirst({
    where: { id: AGRONOMY_DEPARTMENT_ID },
  });
}

/**
 * Get all Agronomy equipment
 */
export async function getAgronomyEquipment(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const agronomyDepartment = await getAgronomyDepartment();

    if (!agronomyDepartment) {
      return { success: false, message: "Agronomy department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agronomyDepartment.id) {
      return { success: false, message: "Not authorized to view Agronomy equipment" };
    }

    const equipment = await prisma.agronomyLabEquipment.findMany({
      where: { departmentId: agronomyDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error fetching Agronomy equipment:", error);
    return { success: false, message: "Failed to fetch Agronomy equipment" };
  }
}

/**
 * Get a single Agronomy equipment by ID
 */
export async function getAgronomyEquipmentById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const equipment = await prisma.agronomyLabEquipment.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!equipment) {
      return { success: false, message: "Equipment not found" };
    }

    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error fetching Agronomy equipment:", error);
    return { success: false, message: "Failed to fetch Agronomy equipment" };
  }
}

/**
 * Create a new Agronomy equipment
 */
export async function createAgronomyEquipment(data: AgronomyEquipmentInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const agronomyDepartment = await getAgronomyDepartment();

    if (!agronomyDepartment) {
      return { success: false, message: "Agronomy department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agronomyDepartment.id) {
      return { success: false, message: "Not authorized to create Agronomy equipment" };
    }

    // Validate input
    const validatedFields = agronomyEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.agronomyLabEquipment.create({
      data: {
        ...validatedFields.data,
        departmentId: agronomyDepartment.id,
      },
    });

    revalidatePath(DASHBOARD_PATH);
    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error creating Agronomy equipment:", error);
    return { success: false, message: "Failed to create Agronomy equipment" };
  }
}

/**
 * Update an existing Agronomy equipment
 */
export async function updateAgronomyEquipment(
  id: string,
  data: AgronomyEquipmentInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const agronomyDepartment = await getAgronomyDepartment();

    if (!agronomyDepartment) {
      return { success: false, message: "Agronomy department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agronomyDepartment.id) {
      return { success: false, message: "Not authorized to update Agronomy equipment" };
    }

    // Validate input
    const validatedFields = agronomyEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.agronomyLabEquipment.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath(DASHBOARD_PATH);
    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error updating Agronomy equipment:", error);
    return { success: false, message: "Failed to update Agronomy equipment" };
  }
}

/**
 * Delete an Agronomy equipment
 */
export async function deleteAgronomyEquipment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const agronomyDepartment = await getAgronomyDepartment();

    if (!agronomyDepartment) {
      return { success: false, message: "Agronomy department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agronomyDepartment.id) {
      return { success: false, message: "Not authorized to delete Agronomy equipment" };
    }

    await prisma.agronomyLabEquipment.delete({
      where: { id },
    });

    revalidatePath(DASHBOARD_PATH);
    return { success: true, message: "Equipment deleted successfully" };
  } catch (error) {
    console.error("Error deleting Agronomy equipment:", error);
    return { success: false, message: "Failed to delete Agronomy equipment" };
  }
}
