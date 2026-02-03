"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for MNSUAM facility
const mnsuamFacilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  blockName: z.string().optional().nullable(),
  facilityType: z.string().optional().nullable(),
  capacityPersons: z.number().int().optional().nullable(),
  capacityLabel: z.string().optional().nullable(),
  displayOrder: z.number().int().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type MNSUAMFacilityInput = z.infer<typeof mnsuamFacilitySchema>;

/**
 * Get all MNSUAM facilities for the MNSUAM department
 */
export async function getMNSUAMFacilities(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return { success: false, message: "MNSUAM department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return { success: false, message: "Not authorized to view MNSUAM facilities" };
    }

    const facilities = await prisma.mNSUAMEstateFacilities.findMany({
      where: { departmentId: mnsuamDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, data: facilities };
  } catch (error) {
    console.error("Error fetching MNSUAM facilities:", error);
    return { success: false, message: "Failed to fetch MNSUAM facilities" };
  }
}

/**
 * Get a single MNSUAM facility by ID
 */
export async function getMNSUAMFacilityById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const facility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!facility) {
      return { success: false, message: "Facility not found" };
    }

    return { success: true, data: facility };
  } catch (error) {
    console.error("Error fetching MNSUAM facility:", error);
    return { success: false, message: "Failed to fetch MNSUAM facility" };
  }
}

/**
 * Create a new MNSUAM facility
 */
export async function createMNSUAMFacility(data: MNSUAMFacilityInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return { success: false, message: "MNSUAM department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return { success: false, message: "Not authorized to create MNSUAM facilities" };
    }

    // Validate input
    const validatedFields = mnsuamFacilitySchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const facility = await prisma.mNSUAMEstateFacilities.create({
      data: {
        ...validatedFields.data,
        departmentId: mnsuamDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/mnsuam");
    revalidatePath("/dashboard");

    return { success: true, message: "Facility created successfully", data: facility };
  } catch (error) {
    console.error("Error creating MNSUAM facility:", error);
    return { success: false, message: "Failed to create MNSUAM facility" };
  }
}

/**
 * Update an MNSUAM facility
 */
export async function updateMNSUAMFacility(id: string, data: MNSUAMFacilityInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return { success: false, message: "MNSUAM department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return { success: false, message: "Not authorized to update MNSUAM facilities" };
    }

    // Check if facility exists
    const existingFacility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return { success: false, message: "Facility not found" };
    }

    // Validate input
    const validatedFields = mnsuamFacilitySchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const facility = await prisma.mNSUAMEstateFacilities.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/mnsuam");
    revalidatePath("/dashboard");

    return { success: true, message: "Facility updated successfully", data: facility };
  } catch (error) {
    console.error("Error updating MNSUAM facility:", error);
    return { success: false, message: "Failed to update MNSUAM facility" };
  }
}

/**
 * Delete an MNSUAM facility
 */
export async function deleteMNSUAMFacility(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MNSUAM department
    const mnsuamDepartment = await prisma.department.findFirst({
      where: { id: "mnsuam" },
    });

    if (!mnsuamDepartment) {
      return { success: false, message: "MNSUAM department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mnsuamDepartment.id) {
      return { success: false, message: "Not authorized to delete MNSUAM facilities" };
    }

    // Check if facility exists
    const existingFacility = await prisma.mNSUAMEstateFacilities.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return { success: false, message: "Facility not found" };
    }

    await prisma.mNSUAMEstateFacilities.delete({
      where: { id },
    });

    revalidatePath("/dashboard/mnsuam");
    revalidatePath("/dashboard");

    return { success: true, message: "Facility deleted successfully" };
  } catch (error) {
    console.error("Error deleting MNSUAM facility:", error);
    return { success: false, message: "Failed to delete MNSUAM facility" };
  }
}
