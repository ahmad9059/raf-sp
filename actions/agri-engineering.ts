"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for Agri Engineering asset
const agriEngineeringAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional().nullable(),
  divisionOrCity: z.string().optional().nullable(),
  officeName: z.string().optional().nullable(),
  quantityOrArea: z.string().optional().nullable(),
  contactDetails: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type AgriEngineeringAssetInput = z.infer<typeof agriEngineeringAssetSchema>;

/**
 * Get all Agri Engineering assets
 */
export async function getAgriEngineeringAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agri Engineering department
    const agriEngDepartment = await prisma.department.findFirst({
      where: { id: "agri-eng" },
    });

    if (!agriEngDepartment) {
      return { success: false, message: "Agricultural Engineering department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriEngDepartment.id) {
      return { success: false, message: "Not authorized to view Agricultural Engineering assets" };
    }

    const assets = await prisma.agriEngineeringMultanRegionData.findMany({
      where: { departmentId: agriEngDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching Agricultural Engineering assets:", error);
    return { success: false, message: "Failed to fetch Agricultural Engineering assets" };
  }
}

/**
 * Get a single Agri Engineering asset by ID
 */
export async function getAgriEngineeringAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.agriEngineeringMultanRegionData.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!asset) {
      return { success: false, message: "Asset not found" };
    }

    return { success: true, data: asset };
  } catch (error) {
    console.error("Error fetching Agricultural Engineering asset:", error);
    return { success: false, message: "Failed to fetch Agricultural Engineering asset" };
  }
}

/**
 * Create a new Agri Engineering asset
 */
export async function createAgriEngineeringAsset(data: AgriEngineeringAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agri Engineering department
    const agriEngDepartment = await prisma.department.findFirst({
      where: { id: "agri-eng" },
    });

    if (!agriEngDepartment) {
      return { success: false, message: "Agricultural Engineering department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriEngDepartment.id) {
      return { success: false, message: "Not authorized to create Agricultural Engineering assets" };
    }

    // Validate input
    const validatedFields = agriEngineeringAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.agriEngineeringMultanRegionData.create({
      data: {
        ...validatedFields.data,
        departmentId: agriEngDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/agri-engineering");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating Agricultural Engineering asset:", error);
    return { success: false, message: "Failed to create Agricultural Engineering asset" };
  }
}

/**
 * Update an Agri Engineering asset
 */
export async function updateAgriEngineeringAsset(id: string, data: AgriEngineeringAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agri Engineering department
    const agriEngDepartment = await prisma.department.findFirst({
      where: { id: "agri-eng" },
    });

    if (!agriEngDepartment) {
      return { success: false, message: "Agricultural Engineering department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriEngDepartment.id) {
      return { success: false, message: "Not authorized to update Agricultural Engineering assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.agriEngineeringMultanRegionData.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = agriEngineeringAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.agriEngineeringMultanRegionData.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/agri-engineering");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating Agricultural Engineering asset:", error);
    return { success: false, message: "Failed to update Agricultural Engineering asset" };
  }
}

/**
 * Delete an Agri Engineering asset
 */
export async function deleteAgriEngineeringAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agri Engineering department
    const agriEngDepartment = await prisma.department.findFirst({
      where: { id: "agri-eng" },
    });

    if (!agriEngDepartment) {
      return { success: false, message: "Agricultural Engineering department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriEngDepartment.id) {
      return { success: false, message: "Not authorized to delete Agricultural Engineering assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.agriEngineeringMultanRegionData.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.agriEngineeringMultanRegionData.delete({
      where: { id },
    });

    revalidatePath("/dashboard/agri-engineering");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting Agricultural Engineering asset:", error);
    return { success: false, message: "Failed to delete Agricultural Engineering asset" };
  }
}
