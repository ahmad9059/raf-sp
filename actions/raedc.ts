"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for RAEDC equipment
const raedcEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  facilityType: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  location: z.string().optional().nullable(),
  functionality: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type RAEDCEquipmentInput = z.infer<typeof raedcEquipmentSchema>;

/**
 * Get all RAEDC equipment for the RAEDC department
 */
export async function getRAEDCEquipment(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return { success: false, message: "RAEDC department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return { success: false, message: "Not authorized to view RAEDC equipment" };
    }

    const equipment = await prisma.rAEDCEquipment.findMany({
      where: { departmentId: raedcDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error fetching RAEDC equipment:", error);
    return { success: false, message: "Failed to fetch RAEDC equipment" };
  }
}

/**
 * Get a single RAEDC equipment by ID
 */
export async function getRAEDCEquipmentById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const equipment = await prisma.rAEDCEquipment.findUnique({
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
    console.error("Error fetching RAEDC equipment:", error);
    return { success: false, message: "Failed to fetch RAEDC equipment" };
  }
}

/**
 * Create a new RAEDC equipment
 */
export async function createRAEDCEquipment(data: RAEDCEquipmentInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return { success: false, message: "RAEDC department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return { success: false, message: "Not authorized to create RAEDC equipment" };
    }

    // Validate input
    const validatedFields = raedcEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.rAEDCEquipment.create({
      data: {
        ...validatedFields.data,
        departmentId: raedcDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/raedc");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment created successfully", data: equipment };
  } catch (error) {
    console.error("Error creating RAEDC equipment:", error);
    return { success: false, message: "Failed to create RAEDC equipment" };
  }
}

/**
 * Update a RAEDC equipment
 */
export async function updateRAEDCEquipment(id: string, data: RAEDCEquipmentInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return { success: false, message: "RAEDC department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return { success: false, message: "Not authorized to update RAEDC equipment" };
    }

    // Check if equipment exists
    const existingEquipment = await prisma.rAEDCEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return { success: false, message: "Equipment not found" };
    }

    // Validate input
    const validatedFields = raedcEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.rAEDCEquipment.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/raedc");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment updated successfully", data: equipment };
  } catch (error) {
    console.error("Error updating RAEDC equipment:", error);
    return { success: false, message: "Failed to update RAEDC equipment" };
  }
}

/**
 * Delete a RAEDC equipment
 */
export async function deleteRAEDCEquipment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RAEDC department
    const raedcDepartment = await prisma.department.findFirst({
      where: { id: "raedc" },
    });

    if (!raedcDepartment) {
      return { success: false, message: "RAEDC department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== raedcDepartment.id) {
      return { success: false, message: "Not authorized to delete RAEDC equipment" };
    }

    // Check if equipment exists
    const existingEquipment = await prisma.rAEDCEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return { success: false, message: "Equipment not found" };
    }

    await prisma.rAEDCEquipment.delete({
      where: { id },
    });

    revalidatePath("/dashboard/raedc");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment deleted successfully" };
  } catch (error) {
    console.error("Error deleting RAEDC equipment:", error);
    return { success: false, message: "Failed to delete RAEDC equipment" };
  }
}
