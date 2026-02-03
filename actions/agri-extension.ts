"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for Agricultural Extension Wing asset
const agriExtensionAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  areaSquareFeet: z.number().int().nullable().optional(),
  remarks: z.string().nullable().optional(),
  status: z.string().min(1, "Status is required"), // Utilized, Unused, etc.
  functionality: z.string().nullable().optional(),
  equipmentStatus: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
});

export type AgriExtensionAssetInput = z.infer<typeof agriExtensionAssetSchema>;

/**
 * Get all Agricultural Extension Wing assets
 */
export async function getAgriExtensionAssets(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return { success: false, message: "Agricultural Extension Wing department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return { success: false, message: "Not authorized to view Agricultural Extension Wing assets" };
    }

    const assets = await prisma.agriculturalExtensionWing.findMany({
      where: { departmentId: agriExtDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: assets };
  } catch (error) {
    console.error("Error fetching Agricultural Extension Wing assets:", error);
    return { success: false, message: "Failed to fetch Agricultural Extension Wing assets" };
  }
}

/**
 * Get a single Agricultural Extension Wing asset by ID
 */
export async function getAgriExtensionAssetById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const asset = await prisma.agriculturalExtensionWing.findUnique({
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
    console.error("Error fetching Agricultural Extension Wing asset:", error);
    return { success: false, message: "Failed to fetch Agricultural Extension Wing asset" };
  }
}

/**
 * Create a new Agricultural Extension Wing asset
 */
export async function createAgriExtensionAsset(data: AgriExtensionAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return { success: false, message: "Agricultural Extension Wing department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return { success: false, message: "Not authorized to create Agricultural Extension Wing assets" };
    }

    // Validate input
    const validatedFields = agriExtensionAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.agriculturalExtensionWing.create({
      data: {
        ...validatedFields.data,
        departmentId: agriExtDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/agri-extension");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset created successfully", data: asset };
  } catch (error) {
    console.error("Error creating Agricultural Extension Wing asset:", error);
    return { success: false, message: "Failed to create Agricultural Extension Wing asset" };
  }
}

/**
 * Update an Agricultural Extension Wing asset
 */
export async function updateAgriExtensionAsset(id: string, data: AgriExtensionAssetInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return { success: false, message: "Agricultural Extension Wing department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return { success: false, message: "Not authorized to update Agricultural Extension Wing assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.agriculturalExtensionWing.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    // Validate input
    const validatedFields = agriExtensionAssetSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const asset = await prisma.agriculturalExtensionWing.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/agri-extension");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset updated successfully", data: asset };
  } catch (error) {
    console.error("Error updating Agricultural Extension Wing asset:", error);
    return { success: false, message: "Failed to update Agricultural Extension Wing asset" };
  }
}

/**
 * Delete an Agricultural Extension Wing asset
 */
export async function deleteAgriExtensionAsset(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find Agricultural Extension department
    const agriExtDepartment = await prisma.department.findFirst({
      where: { id: "agri-ext" },
    });

    if (!agriExtDepartment) {
      return { success: false, message: "Agricultural Extension Wing department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== agriExtDepartment.id) {
      return { success: false, message: "Not authorized to delete Agricultural Extension Wing assets" };
    }

    // Check if asset exists
    const existingAsset = await prisma.agriculturalExtensionWing.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return { success: false, message: "Asset not found" };
    }

    await prisma.agriculturalExtensionWing.delete({
      where: { id },
    });

    revalidatePath("/dashboard/agri-extension");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset deleted successfully" };
  } catch (error) {
    console.error("Error deleting Agricultural Extension Wing asset:", error);
    return { success: false, message: "Failed to delete Agricultural Extension Wing asset" };
  }
}
