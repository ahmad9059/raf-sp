"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  maintenanceLogSchema,
  type MaintenanceLogInput,
} from "@/lib/validations/maintenance";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Server action to create a new maintenance log entry
 * Requirements: 7.1, 7.3, 7.4, 7.5
 */
export async function createMaintenanceLog(
  data: MaintenanceLogInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Validate input
    const validatedFields = maintenanceLogSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { equipmentId, date, cost, description } = validatedFields.data;

    // Check if equipment exists and user has permission
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        department: true,
      },
    });

    if (!equipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only create logs for equipment in their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (equipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message:
            "You can only create maintenance logs for equipment in your department",
        };
      }
    }

    // Create maintenance log
    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        equipmentId,
        date,
        cost,
        description,
      },
      include: {
        equipment: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${equipmentId}`);

    return {
      success: true,
      message: "Maintenance log created successfully",
      data: maintenanceLog,
    };
  } catch (error) {
    console.error("Create maintenance log error:", error);
    return {
      success: false,
      message: "An error occurred while creating maintenance log",
    };
  }
}

/**
 * Server action to get maintenance logs for a specific equipment with filtering
 * Requirements: 7.1, 7.3
 */
export async function getMaintenanceLogs(
  equipmentId: string
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Check if equipment exists and user has permission
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      select: {
        id: true,
        departmentId: true,
      },
    });

    if (!equipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only view logs for equipment in their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (equipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message:
            "You can only view maintenance logs for equipment in your department",
        };
      }
    }

    // Get maintenance logs with total cost calculation
    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where: { equipmentId },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate total maintenance cost
    const totalCost = maintenanceLogs.reduce(
      (sum, log) => sum + Number(log.cost),
      0
    );

    return {
      success: true,
      data: {
        logs: maintenanceLogs,
        totalCost,
      },
    };
  } catch (error) {
    console.error("Get maintenance logs error:", error);
    return {
      success: false,
      message: "An error occurred while fetching maintenance logs",
    };
  }
}

/**
 * Server action to delete a maintenance log entry
 * Requirements: 7.2
 */
export async function deleteMaintenanceLog(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Check if maintenance log exists and get equipment info
    const maintenanceLog = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: {
        equipment: {
          select: {
            id: true,
            departmentId: true,
          },
        },
      },
    });

    if (!maintenanceLog) {
      return {
        success: false,
        message: "Maintenance log not found",
      };
    }

    // Authorization check: DEPT_HEAD can only delete logs for equipment in their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (maintenanceLog.equipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message:
            "You can only delete maintenance logs for equipment in your department",
        };
      }
    }

    // Delete maintenance log
    await prisma.maintenanceLog.delete({
      where: { id },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${maintenanceLog.equipment.id}`);

    return {
      success: true,
      message: "Maintenance log deleted successfully",
    };
  } catch (error) {
    console.error("Delete maintenance log error:", error);
    return {
      success: false,
      message: "An error occurred while deleting maintenance log",
    };
  }
}

/**
 * Server action to get maintenance logs for all equipment in user's scope
 * Used for dashboard statistics and reports
 */
export async function getAllMaintenanceLogs(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Build where clause based on role
    const whereClause: any = {};

    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      whereClause.equipment = {
        departmentId: userDepartmentId,
      };
    }

    // Get maintenance logs with equipment info
    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where: whereClause,
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate total cost
    const totalCost = maintenanceLogs.reduce(
      (sum, log) => sum + Number(log.cost),
      0
    );

    return {
      success: true,
      data: {
        logs: maintenanceLogs,
        totalCost,
      },
    };
  } catch (error) {
    console.error("Get all maintenance logs error:", error);
    return {
      success: false,
      message: "An error occurred while fetching maintenance logs",
    };
  }
}
