"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  departmentSchema,
  type DepartmentInput,
} from "@/lib/validations/department";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Server action to create a new department (Admin only)
 * Requirements: 9.1
 */
export async function createDepartment(
  data: DepartmentInput
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

    // Validate input
    const validatedFields = departmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, location, logo } = validatedFields.data;

    // Check if department name already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name },
    });

    if (existingDepartment) {
      return {
        success: false,
        message: "A department with this name already exists",
      };
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        location,
        logo: logo || null,
      },
      include: {
        _count: {
          select: {
            equipment: true,
            users: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/departments");

    return {
      success: true,
      message: "Department created successfully",
      data: department,
    };
  } catch (error) {
    console.error("Create department error:", error);
    return {
      success: false,
      message: "An error occurred while creating department",
    };
  }
}

/**
 * Server action to update an existing department (Admin only)
 * Requirements: 9.2
 */
export async function updateDepartment(
  id: string,
  data: Partial<DepartmentInput>
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

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    // Validate input (partial validation for updates)
    const validatedFields = departmentSchema.partial().safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Check if new name conflicts with existing department (if name is being changed)
    if (
      validatedFields.data.name &&
      validatedFields.data.name !== existingDepartment.name
    ) {
      const nameConflict = await prisma.department.findUnique({
        where: { name: validatedFields.data.name },
      });

      if (nameConflict) {
        return {
          success: false,
          message: "A department with this name already exists",
        };
      }
    }

    // Update department
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        ...validatedFields.data,
        logo: validatedFields.data.logo || existingDepartment.logo,
      },
      include: {
        _count: {
          select: {
            equipment: true,
            users: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/departments");

    return {
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    };
  } catch (error) {
    console.error("Update department error:", error);
    return {
      success: false,
      message: "An error occurred while updating department",
    };
  }
}

/**
 * Server action to delete a department (Admin only)
 * Requirements: 9.3
 */
export async function deleteDepartment(id: string): Promise<ActionResult> {
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

    // Check if department exists and get equipment count
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            equipment: true,
            users: true,
          },
        },
      },
    });

    if (!existingDepartment) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    // Prevent deletion if department has equipment
    if (existingDepartment._count.equipment > 0) {
      return {
        success: false,
        message: `Cannot delete department. It has ${existingDepartment._count.equipment} equipment records. Please reassign or delete the equipment first.`,
      };
    }

    // Prevent deletion if department has users
    if (existingDepartment._count.users > 0) {
      return {
        success: false,
        message: `Cannot delete department. It has ${existingDepartment._count.users} assigned users. Please reassign the users first.`,
      };
    }

    // Delete department
    await prisma.department.delete({
      where: { id },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/departments");

    return {
      success: true,
      message: "Department deleted successfully",
    };
  } catch (error) {
    console.error("Delete department error:", error);
    return {
      success: false,
      message: "An error occurred while deleting department",
    };
  }
}

/**
 * Server action to get all departments (All authenticated users can view)
 */
export async function getDepartments(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            equipment: true,
            users: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: departments,
    };
  } catch (error) {
    console.error("Get departments error:", error);
    return {
      success: false,
      message: "An error occurred while fetching departments",
    };
  }
}

/**
 * Server action to get a single department by ID (Admin only)
 */
export async function getDepartmentById(id: string): Promise<ActionResult> {
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

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            equipment: true,
            users: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        equipment: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
          take: 10, // Limit to recent 10 equipment items
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!department) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    console.error("Get department error:", error);
    return {
      success: false,
      message: "An error occurred while fetching department",
    };
  }
}
