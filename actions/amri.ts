"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for AMRI asset
const amriAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  assetCategory: z.string().optional().nullable(),
  itemDescription: z.string().optional().nullable(),
  quantityOrArea: z.string().optional().nullable(),
  functionalStatus: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type AMRIAssetInput = z.infer<typeof amriAssetSchema>;

/**
 * Get all AMRI assets for the AMRI department
 */
export async function getAMRIAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return { success: false, message: "AMRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return { success: false, message: "Not authorized to view AMRI assets" };
    }

    const assets = await prisma.aMRIInventory.findMany({
      where: { departmentId: amriDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching AMRI assets:", error);
    return { success: false, message: "Failed to fetch AMRI assets" };
  }
}

/**
 * Get a single AMRI asset by ID
 */
export async function getAMRIAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.aMRIInventory.findUnique({
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
    console.error("Error fetching AMRI asset:", error);
    return { success: false, message: "Failed to fetch AMRI asset" };
  }
}

/**
 * Create a new AMRI asset
 */
export async function createAMRIAsset(data: AMRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return { success: false, message: "AMRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return { success: false, message: "Not authorized to create AMRI assets" };
    }

    // Validate input
    const validatedFields = amriAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.aMRIInventory.create({
      data: {
        ...validatedFields.data,
        departmentId: amriDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/amri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating AMRI asset:", error);
    return { success: false, message: "Failed to create AMRI asset" };
  }
}

/**
 * Update an AMRI asset
 */
export async function updateAMRIAsset(id: string, data: AMRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return { success: false, message: "AMRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return { success: false, message: "Not authorized to update AMRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.aMRIInventory.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = amriAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.aMRIInventory.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/amri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating AMRI asset:", error);
    return { success: false, message: "Failed to update AMRI asset" };
  }
}

/**
 * Delete an AMRI asset
 */
export async function deleteAMRIAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find AMRI department
    const amriDepartment = await prisma.department.findFirst({
      where: { id: "amri" },
    });

    if (!amriDepartment) {
      return { success: false, message: "AMRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== amriDepartment.id) {
      return { success: false, message: "Not authorized to delete AMRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.aMRIInventory.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.aMRIInventory.delete({
      where: { id },
    });

    revalidatePath("/dashboard/amri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting AMRI asset:", error);
    return { success: false, message: "Failed to delete AMRI asset" };
  }
}
