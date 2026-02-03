"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for MRI asset
const mriAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  itemNameOrDesignation: z.string().optional(),
  bpsScale: z.number().int().optional().nullable(),
  totalQuantityOrPosts: z.number().int().optional().nullable(),
  filledOrFunctional: z.number().int().optional().nullable(),
  vacantOrNonFunctional: z.number().int().optional().nullable(),
  remarksOrLocation: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type MRIAssetInput = z.infer<typeof mriAssetSchema>;

/**
 * Get all MRI assets for the MRI department
 */
export async function getMRIAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return { success: false, message: "MRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return { success: false, message: "Not authorized to view MRI assets" };
    }

    const assets = await prisma.mRIAssets.findMany({
      where: { departmentId: mriDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching MRI assets:", error);
    return { success: false, message: "Failed to fetch MRI assets" };
  }
}

/**
 * Get a single MRI asset by ID
 */
export async function getMRIAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.mRIAssets.findUnique({
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
    console.error("Error fetching MRI asset:", error);
    return { success: false, message: "Failed to fetch MRI asset" };
  }
}

/**
 * Create a new MRI asset
 */
export async function createMRIAsset(data: MRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return { success: false, message: "MRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return { success: false, message: "Not authorized to create MRI assets" };
    }

    // Validate input
    const validatedFields = mriAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.mRIAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: mriDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/mri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating MRI asset:", error);
    return { success: false, message: "Failed to create MRI asset" };
  }
}

/**
 * Update an MRI asset
 */
export async function updateMRIAsset(id: string, data: MRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return { success: false, message: "MRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return { success: false, message: "Not authorized to update MRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.mRIAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = mriAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.mRIAssets.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/mri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating MRI asset:", error);
    return { success: false, message: "Failed to update MRI asset" };
  }
}

/**
 * Delete an MRI asset
 */
export async function deleteMRIAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find MRI department
    const mriDepartment = await prisma.department.findFirst({
      where: { id: "mri" },
    });

    if (!mriDepartment) {
      return { success: false, message: "MRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== mriDepartment.id) {
      return { success: false, message: "Not authorized to delete MRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.mRIAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.mRIAssets.delete({
      where: { id },
    });

    revalidatePath("/dashboard/mri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting MRI asset:", error);
    return { success: false, message: "Failed to delete MRI asset" };
  }
}
