"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for RARI asset
const rariAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  makeModelYear: z.string().optional().nullable(),
  quantity: z.number().int().optional().nullable(),
  conditionStatus: z.string().optional().nullable(),
  useApplication: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type RARIAssetInput = z.infer<typeof rariAssetSchema>;

/**
 * Get all RARI assets for the RARI department
 */
export async function getRARIAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return { success: false, message: "RARI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return { success: false, message: "Not authorized to view RARI assets" };
    }

    const assets = await prisma.rARIBahawalpurAssets.findMany({
      where: { departmentId: rariDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching RARI assets:", error);
    return { success: false, message: "Failed to fetch RARI assets" };
  }
}

/**
 * Get a single RARI asset by ID
 */
export async function getRARIAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.rARIBahawalpurAssets.findUnique({
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
    console.error("Error fetching RARI asset:", error);
    return { success: false, message: "Failed to fetch RARI asset" };
  }
}

/**
 * Create a new RARI asset
 */
export async function createRARIAsset(data: RARIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return { success: false, message: "RARI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return { success: false, message: "Not authorized to create RARI assets" };
    }

    // Validate input
    const validatedFields = rariAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.rARIBahawalpurAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: rariDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/rari");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating RARI asset:", error);
    return { success: false, message: "Failed to create RARI asset" };
  }
}

/**
 * Update a RARI asset
 */
export async function updateRARIAsset(id: string, data: RARIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return { success: false, message: "RARI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return { success: false, message: "Not authorized to update RARI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.rARIBahawalpurAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = rariAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.rARIBahawalpurAssets.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/rari");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating RARI asset:", error);
    return { success: false, message: "Failed to update RARI asset" };
  }
}

/**
 * Delete a RARI asset
 */
export async function deleteRARIAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find RARI department
    const rariDepartment = await prisma.department.findFirst({
      where: { id: "rari" },
    });

    if (!rariDepartment) {
      return { success: false, message: "RARI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== rariDepartment.id) {
      return { success: false, message: "Not authorized to delete RARI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.rARIBahawalpurAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.rARIBahawalpurAssets.delete({
      where: { id },
    });

    revalidatePath("/dashboard/rari");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting RARI asset:", error);
    return { success: false, message: "Failed to delete RARI asset" };
  }
}
