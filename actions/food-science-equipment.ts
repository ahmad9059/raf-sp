"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";

/**
 * Server action to get Food Science & Technology equipment
 */
export async function getFoodScienceEquipment(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Find the Food Science and Technology department
    const foodScienceDept = await prisma.department.findUnique({
      where: { name: "Food Science and Technology" },
    });

    if (!foodScienceDept) {
      return {
        success: false,
        message: "Food Science and Technology department not found",
      };
    }

    // Get equipment from the FoodAnalysisLabEquipment table
    const equipment = await prisma.foodAnalysisLabEquipment.findMany({
      where: {
        departmentId: foodScienceDept.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get Food Science equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Server action to create Food Science equipment (for seeding purposes)
 */
export async function createFoodScienceEquipment(
  equipmentData: any[]
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Only allow admin to seed data
    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Access denied. Admin privileges required.",
      };
    }

    // Find the Food Science and Technology department
    const foodScienceDept = await prisma.department.findUnique({
      where: { name: "Food Science and Technology" },
    });

    if (!foodScienceDept) {
      return {
        success: false,
        message: "Food Science and Technology department not found",
      };
    }

    // Clear existing equipment
    await prisma.foodAnalysisLabEquipment.deleteMany({
      where: { departmentId: foodScienceDept.id },
    });

    // Create new equipment records
    const createdEquipment = [];
    for (const equipment of equipmentData) {
      const created = await prisma.foodAnalysisLabEquipment.create({
        data: {
          ...equipment,
          departmentId: foodScienceDept.id,
        },
      });
      createdEquipment.push(created);
    }

    return {
      success: true,
      message: `Successfully created ${createdEquipment.length} equipment records`,
      data: createdEquipment,
    };
  } catch (error) {
    console.error("Create Food Science equipment error:", error);
    return {
      success: false,
      message: "An error occurred while creating equipment",
    };
  }
}
