"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for Soil Water Testing Project
const soilWaterProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  bps: z.number().int().optional().nullable(),
  quantityRequired: z.number().int().optional().nullable(),
  budgetAllocationTotalMillion: z.number().optional().nullable(),
  justificationOrYear: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type SoilWaterProjectInput = z.infer<typeof soilWaterProjectSchema>;

/**
 * Get all Soil Water Testing projects for the department
 */
export async function getSoilWaterProjects(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return { success: false, message: "Soil & Water Testing Laboratory department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return { success: false, message: "Not authorized to view Soil & Water projects" };
    }

    const projects = await prisma.soilWaterTestingProject.findMany({
      where: { departmentId: soilWaterDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching Soil Water projects:", error);
    return { success: false, message: "Failed to fetch Soil & Water projects" };
  }
}

/**
 * Get a single Soil Water Testing project by ID
 */
export async function getSoilWaterProjectById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const project = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching Soil Water project:", error);
    return { success: false, message: "Failed to fetch Soil & Water project" };
  }
}

/**
 * Create a new Soil Water Testing project
 */
export async function createSoilWaterProject(data: SoilWaterProjectInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return { success: false, message: "Soil & Water Testing Laboratory department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return { success: false, message: "Not authorized to create Soil & Water projects" };
    }

    // Validate input
    const validatedFields = soilWaterProjectSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const project = await prisma.soilWaterTestingProject.create({
      data: {
        ...validatedFields.data,
        departmentId: soilWaterDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/soil-water");
    revalidatePath("/dashboard");

    return { success: true, message: "Project created successfully", data: project };
  } catch (error) {
    console.error("Error creating Soil Water project:", error);
    return { success: false, message: "Failed to create Soil & Water project" };
  }
}

/**
 * Update a Soil Water Testing project
 */
export async function updateSoilWaterProject(id: string, data: SoilWaterProjectInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return { success: false, message: "Soil & Water Testing Laboratory department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return { success: false, message: "Not authorized to update Soil & Water projects" };
    }

    // Check if project exists
    const existingProject = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return { success: false, message: "Project not found" };
    }

    // Validate input
    const validatedFields = soilWaterProjectSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const project = await prisma.soilWaterTestingProject.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/soil-water");
    revalidatePath("/dashboard");

    return { success: true, message: "Project updated successfully", data: project };
  } catch (error) {
    console.error("Error updating Soil Water project:", error);
    return { success: false, message: "Failed to update Soil & Water project" };
  }
}

/**
 * Delete a Soil Water Testing project
 */
export async function deleteSoilWaterProject(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Soil Water department
    const soilWaterDepartment = await prisma.department.findFirst({
      where: { id: "soil-water" },
    });

    if (!soilWaterDepartment) {
      return { success: false, message: "Soil & Water Testing Laboratory department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== soilWaterDepartment.id) {
      return { success: false, message: "Not authorized to delete Soil & Water projects" };
    }

    // Check if project exists
    const existingProject = await prisma.soilWaterTestingProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return { success: false, message: "Project not found" };
    }

    await prisma.soilWaterTestingProject.delete({
      where: { id },
    });

    revalidatePath("/dashboard/soil-water");
    revalidatePath("/dashboard");

    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting Soil Water project:", error);
    return { success: false, message: "Failed to delete Soil & Water project" };
  }
}
