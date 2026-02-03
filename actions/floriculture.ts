"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for Floriculture asset
const floricultureAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  itemNameOrPost: z.string().optional(),
  bpsScale: z.string().optional().nullable(),
  sanctionedQty: z.number().int().optional().nullable(),
  inPositionQty: z.number().int().optional().nullable(),
  detailsOrArea: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type FloricultureAssetInput = z.infer<typeof floricultureAssetSchema>;

/**
 * Get all Floriculture assets for the Floriculture department
 */
export async function getFloricultureAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return { success: false, message: "Floriculture department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return { success: false, message: "Not authorized to view Floriculture assets" };
    }

    const assets = await prisma.floricultureStationAssets.findMany({
      where: { departmentId: floricultureDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching Floriculture assets:", error);
    return { success: false, message: "Failed to fetch Floriculture assets" };
  }
}

/**
 * Get a single Floriculture asset by ID
 */
export async function getFloricultureAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.floricultureStationAssets.findUnique({
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
    console.error("Error fetching Floriculture asset:", error);
    return { success: false, message: "Failed to fetch Floriculture asset" };
  }
}

/**
 * Create a new Floriculture asset
 */
export async function createFloricultureAsset(data: FloricultureAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return { success: false, message: "Floriculture department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return { success: false, message: "Not authorized to create Floriculture assets" };
    }

    // Validate input
    const validatedFields = floricultureAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.floricultureStationAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: floricultureDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/floriculture");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating Floriculture asset:", error);
    return { success: false, message: "Failed to create Floriculture asset" };
  }
}

/**
 * Update a Floriculture asset
 */
export async function updateFloricultureAsset(id: string, data: FloricultureAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return { success: false, message: "Floriculture department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return { success: false, message: "Not authorized to update Floriculture assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.floricultureStationAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = floricultureAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.floricultureStationAssets.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/floriculture");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating Floriculture asset:", error);
    return { success: false, message: "Failed to update Floriculture asset" };
  }
}

/**
 * Delete a Floriculture asset
 */
export async function deleteFloricultureAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Floriculture department
    const floricultureDepartment = await prisma.department.findFirst({
      where: { id: "flori" },
    });

    if (!floricultureDepartment) {
      return { success: false, message: "Floriculture department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== floricultureDepartment.id) {
      return { success: false, message: "Not authorized to delete Floriculture assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.floricultureStationAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.floricultureStationAssets.delete({
      where: { id },
    });

    revalidatePath("/dashboard/floriculture");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting Floriculture asset:", error);
    return { success: false, message: "Failed to delete Floriculture asset" };
  }
}
