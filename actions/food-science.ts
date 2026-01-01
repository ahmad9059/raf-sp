"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for Food Science equipment
const foodScienceEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  labSectionName: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  focalPerson: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type FoodScienceEquipmentInput = z.infer<typeof foodScienceEquipmentSchema>;

const ensureFoodScienceDepartment = async () =>
  prisma.department.upsert({
    where: { id: "food-science" },
    update: {
      name: "Food Science and Technology",
      location: "MNS University of Agriculture, Multan",
      description:
        "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
    },
    create: {
      id: "food-science",
      name: "Food Science and Technology",
      location: "MNS University of Agriculture, Multan",
      description:
        "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
    },
  });

/**
 * Get all Food Science equipment
 */
export async function getFoodScienceEquipment(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Ensure Food Science department exists
    const foodScienceDepartment = await ensureFoodScienceDepartment();

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return { success: false, message: "Not authorized to view Food Science equipment" };
    }

    const equipment = await prisma.foodAnalysisLabEquipment.findMany({
      where: { departmentId: foodScienceDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error fetching Food Science equipment:", error);
    return { success: false, message: "Failed to fetch Food Science equipment" };
  }
}

/**
 * Get a single Food Science equipment by ID
 */
export async function getFoodScienceEquipmentById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const equipment = await prisma.foodAnalysisLabEquipment.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!equipment) {
      return { success: false, message: "Equipment not found" };
    }

    return { success: true, data: equipment };
  } catch (error) {
    console.error("Error fetching Food Science equipment:", error);
    return { success: false, message: "Failed to fetch Food Science equipment" };
  }
}

/**
 * Create a new Food Science equipment
 */
export async function createFoodScienceEquipment(data: FoodScienceEquipmentInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const foodScienceDepartment = await ensureFoodScienceDepartment();

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return { success: false, message: "Not authorized to create Food Science equipment" };
    }

    // Validate input
    const validatedFields = foodScienceEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.foodAnalysisLabEquipment.create({
      data: {
        ...validatedFields.data,
        departmentId: foodScienceDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/food-science");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment created successfully", data: equipment };
  } catch (error) {
    console.error("Error creating Food Science equipment:", error);
    return { success: false, message: "Failed to create Food Science equipment" };
  }
}

/**
 * Update a Food Science equipment
 */
export async function updateFoodScienceEquipment(id: string, data: FoodScienceEquipmentInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const foodScienceDepartment = await ensureFoodScienceDepartment();

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return { success: false, message: "Not authorized to update Food Science equipment" };
    }

    // Check if equipment exists
    const existingEquipment = await prisma.foodAnalysisLabEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return { success: false, message: "Equipment not found" };
    }

    // Validate input
    const validatedFields = foodScienceEquipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const equipment = await prisma.foodAnalysisLabEquipment.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/food-science");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment updated successfully", data: equipment };
  } catch (error) {
    console.error("Error updating Food Science equipment:", error);
    return { success: false, message: "Failed to update Food Science equipment" };
  }
}

/**
 * Delete a Food Science equipment
 */
export async function deleteFoodScienceEquipment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    const foodScienceDepartment = await ensureFoodScienceDepartment();

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== foodScienceDepartment.id) {
      return { success: false, message: "Not authorized to delete Food Science equipment" };
    }

    // Check if equipment exists
    const existingEquipment = await prisma.foodAnalysisLabEquipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return { success: false, message: "Equipment not found" };
    }

    await prisma.foodAnalysisLabEquipment.delete({
      where: { id },
    });

    revalidatePath("/dashboard/food-science");
    revalidatePath("/dashboard");

    return { success: true, message: "Equipment deleted successfully" };
  } catch (error) {
    console.error("Error deleting Food Science equipment:", error);
    return { success: false, message: "Failed to delete Food Science equipment" };
  }
}
