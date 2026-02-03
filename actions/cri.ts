"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for CRI asset
const criAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"), // "Laboratory Equipment" or "Farm Machinery"
  imageUrl: z.string().optional().nullable(),
  makeModel: z.string().optional().nullable(),
  labDepartment: z.string().optional().nullable(),
  purposeFunction: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  quantity: z.number().int().default(1),
  operationalStatus: z.string().optional().nullable(), // "Functional" or "Non-Functional"
  description: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
});

export type CRIAssetInput = z.infer<typeof criAssetSchema>;

/**
 * Get all CRI assets for the CRI department
 */
export async function getCRIAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return { success: false, message: "CRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return { success: false, message: "Not authorized to view CRI assets" };
    }

    const assets = await prisma.cRIMultanAssets.findMany({
      where: { departmentId: criDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching CRI assets:", error);
    return { success: false, message: "Failed to fetch CRI assets" };
  }
}

/**
 * Get a single CRI asset by ID
 */
export async function getCRIAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.cRIMultanAssets.findUnique({
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
    console.error("Error fetching CRI asset:", error);
    return { success: false, message: "Failed to fetch CRI asset" };
  }
}

/**
 * Create a new CRI asset
 */
export async function createCRIAsset(data: CRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return { success: false, message: "CRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return { success: false, message: "Not authorized to create CRI assets" };
    }

    // Validate input
    const validatedFields = criAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.cRIMultanAssets.create({
      data: {
        ...validatedFields.data,
        departmentId: criDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/cri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating CRI asset:", error);
    return { success: false, message: "Failed to create CRI asset" };
  }
}

/**
 * Update a CRI asset
 */
export async function updateCRIAsset(id: string, data: CRIAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return { success: false, message: "CRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return { success: false, message: "Not authorized to update CRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.cRIMultanAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = criAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.cRIMultanAssets.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/cri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating CRI asset:", error);
    return { success: false, message: "Failed to update CRI asset" };
  }
}

/**
 * Delete a CRI asset
 */
export async function deleteCRIAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find CRI department
    const criDepartment = await prisma.department.findFirst({
      where: { id: "cri" },
    });

    if (!criDepartment) {
      return { success: false, message: "CRI department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== criDepartment.id) {
      return { success: false, message: "Not authorized to delete CRI assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.cRIMultanAssets.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.cRIMultanAssets.delete({
      where: { id },
    });

    revalidatePath("/dashboard/cri");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting CRI asset:", error);
    return { success: false, message: "Failed to delete CRI asset" };
  }
}
