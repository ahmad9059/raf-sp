"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
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

export type PesticideDataInput = z.infer<typeof pesticideDataSchema>;

/**
 * Get all Pesticide QC Lab data
 */
export async function getPesticideData(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return { success: false, message: "Pesticide QC Lab department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return { success: false, message: "Not authorized to view Pesticide QC Lab data" };
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

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching Pesticide QC Lab data:", error);
    return { success: false, message: "Failed to fetch Pesticide QC Lab data" };
  }
}

/**
 * Get a single Pesticide QC Lab record by ID
 */
export async function getPesticideDataById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const data = await prisma.pesticideQCLabData.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!data) {
      return { success: false, message: "Record not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching Pesticide QC Lab record:", error);
    return { success: false, message: "Failed to fetch Pesticide QC Lab record" };
  }
}

/**
 * Create a new Pesticide QC Lab record
 */
export async function createPesticideData(data: PesticideDataInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return { success: false, message: "Pesticide QC Lab department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return { success: false, message: "Not authorized to create Pesticide QC Lab records" };
    }

    // Validate input
    const validatedFields = pesticideDataSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
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

    revalidatePath("/dashboard/pesticide");
    revalidatePath("/dashboard");

    return { success: true, message: "Record created successfully", data: record };
  } catch (error) {
    console.error("Error creating Pesticide QC Lab record:", error);
    return { success: false, message: "Failed to create Pesticide QC Lab record" };
  }
}

/**
 * Update a Pesticide QC Lab record
 */
export async function updatePesticideData(id: string, data: PesticideDataInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return { success: false, message: "Pesticide QC Lab department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return { success: false, message: "Not authorized to update Pesticide QC Lab records" };
    }

    // Check if record exists
    const existingRecord = await prisma.pesticideQCLabData.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return { success: false, message: "Record not found" };
    }

    // Validate input
    const validatedFields = pesticideDataSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
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

    revalidatePath("/dashboard/pesticide");
    revalidatePath("/dashboard");

    return { success: true, message: "Record updated successfully", data: record };
  } catch (error) {
    console.error("Error updating Pesticide QC Lab record:", error);
    return { success: false, message: "Failed to update Pesticide QC Lab record" };
  }
}

/**
 * Delete a Pesticide QC Lab record
 */
export async function deletePesticideData(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Pesticide department
    const pesticideDepartment = await prisma.department.findFirst({
      where: { id: "pest" },
    });

    if (!pesticideDepartment) {
      return { success: false, message: "Pesticide QC Lab department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== pesticideDepartment.id) {
      return { success: false, message: "Not authorized to delete Pesticide QC Lab records" };
    }

    // Check if record exists
    const existingRecord = await prisma.pesticideQCLabData.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return { success: false, message: "Record not found" };
    }

    await prisma.pesticideQCLabData.delete({
      where: { id },
    });

    revalidatePath("/dashboard/pesticide");
    revalidatePath("/dashboard");

    return { success: true, message: "Record deleted successfully" };
  } catch (error) {
    console.error("Error deleting Pesticide QC Lab record:", error);
    return { success: false, message: "Failed to delete Pesticide QC Lab record" };
  }
}
