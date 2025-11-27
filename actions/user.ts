"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Server action to get all users (Admin only)
 */
export async function getUsers(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role } = session.user;

    // Admin check
    if (role !== "ADMIN") {
      return {
        success: false,
        message: "Access denied. Admin privileges required.",
      };
    }

    const users = await prisma.user.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Get users error:", error);
    return {
      success: false,
      message: "An error occurred while fetching users",
    };
  }
}

/**
 * Server action to update user department assignment (Admin only)
 */
export async function updateUserDepartment(
  userId: string,
  departmentId: string | null
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role } = session.user;

    // Admin check
    if (role !== "ADMIN") {
      return {
        success: false,
        message: "Access denied. Admin privileges required.",
      };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // If departmentId is provided, verify department exists
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        return {
          success: false,
          message: "Invalid department selected",
        };
      }
    }

    // Update user department
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        departmentId: departmentId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: "User department updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update user department error:", error);
    return {
      success: false,
      message: "An error occurred while updating user department",
    };
  }
}

/**
 * Server action to update user role (Admin only)
 */
export async function updateUserRole(
  userId: string,
  role: "ADMIN" | "DEPT_HEAD"
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role: currentUserRole } = session.user;

    // Admin check
    if (currentUserRole !== "ADMIN") {
      return {
        success: false,
        message: "Access denied. Admin privileges required.",
      };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return {
        success: false,
        message: "You cannot change your own role",
      };
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update user role error:", error);
    return {
      success: false,
      message: "An error occurred while updating user role",
    };
  }
}
