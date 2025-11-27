"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/types";
import { EquipmentStatus } from "@prisma/client";

/**
 * Get dashboard statistics with role-based filtering
 * - ADMIN users see stats across all departments
 * - DEPT_HEAD users see stats only for their assigned department
 */
export async function getDashboardStats(
  departmentId?: string
): Promise<DashboardStats> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Determine which department to filter by
    let filterDepartmentId: string | undefined;

    if (role === "ADMIN") {
      // Admin can optionally filter by department, or see all
      filterDepartmentId = departmentId;
    } else if (role === "DEPT_HEAD") {
      // Department heads can only see their own department
      if (!userDepartmentId) {
        throw new Error("Department head must be assigned to a department");
      }
      filterDepartmentId = userDepartmentId;
    } else {
      throw new Error("Invalid role");
    }

    // Build the where clause for filtering
    const whereClause = filterDepartmentId
      ? { departmentId: filterDepartmentId }
      : {};

    // Get total equipment count
    const totalEquipment = await prisma.equipment.count({
      where: whereClause,
    });

    // Get equipment counts by status
    const equipmentByStatus = await prisma.equipment.groupBy({
      by: ["status"],
      where: whereClause,
      _count: {
        status: true,
      },
    });

    // Transform status counts into individual variables
    const availableCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.AVAILABLE
      )?._count.status || 0;
    const inUseCount =
      equipmentByStatus.find((item) => item.status === EquipmentStatus.IN_USE)
        ?._count.status || 0;
    const needsRepairCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.NEEDS_REPAIR
      )?._count.status || 0;
    const discardedCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.DISCARDED
      )?._count.status || 0;

    // Get equipment distribution by type
    const equipmentByType = await prisma.equipment.groupBy({
      by: ["type"],
      where: whereClause,
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: "desc",
        },
      },
    });

    // Transform type counts
    const equipmentByTypeFormatted = equipmentByType.map((item) => ({
      type: item.type,
      count: item._count.type,
    }));

    // Get recent equipment additions (last 10)
    const recentEquipment = await prisma.equipment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        purchaseDate: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate total maintenance cost
    const maintenanceCostResult = await prisma.maintenanceLog.aggregate({
      where: filterDepartmentId
        ? {
            equipment: {
              departmentId: filterDepartmentId,
            },
          }
        : {},
      _sum: {
        cost: true,
      },
    });

    const totalMaintenanceCost = maintenanceCostResult._sum.cost
      ? Number(maintenanceCostResult._sum.cost)
      : 0;

    return {
      totalEquipment,
      availableCount,
      inUseCount,
      needsRepairCount,
      discardedCount,
      equipmentByType: equipmentByTypeFormatted,
      recentEquipment,
      totalMaintenanceCost,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Get dashboard statistics for all departments (for viewing purposes)
 * All authenticated users can view this data
 */
export async function getAllDepartmentsStats(): Promise<DashboardStats> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    // No department filtering - show stats across all departments
    const whereClause = {};

    // Get total equipment count
    const totalEquipment = await prisma.equipment.count({
      where: whereClause,
    });

    // Get equipment counts by status
    const equipmentByStatus = await prisma.equipment.groupBy({
      by: ["status"],
      where: whereClause,
      _count: {
        status: true,
      },
    });

    // Transform status counts into individual variables
    const availableCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.AVAILABLE
      )?._count.status || 0;
    const inUseCount =
      equipmentByStatus.find((item) => item.status === EquipmentStatus.IN_USE)
        ?._count.status || 0;
    const needsRepairCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.NEEDS_REPAIR
      )?._count.status || 0;
    const discardedCount =
      equipmentByStatus.find(
        (item) => item.status === EquipmentStatus.DISCARDED
      )?._count.status || 0;

    // Get equipment distribution by type
    const equipmentByType = await prisma.equipment.groupBy({
      by: ["type"],
      where: whereClause,
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: "desc",
        },
      },
    });

    // Transform type counts
    const equipmentByTypeFormatted = equipmentByType.map((item) => ({
      type: item.type,
      count: item._count.type,
    }));

    // Get recent equipment additions (last 10) across all departments
    const recentEquipment = await prisma.equipment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        purchaseDate: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate total maintenance cost across all departments
    const maintenanceCostResult = await prisma.maintenanceLog.aggregate({
      where: {},
      _sum: {
        cost: true,
      },
    });

    const totalMaintenanceCost = maintenanceCostResult._sum.cost
      ? Number(maintenanceCostResult._sum.cost)
      : 0;

    return {
      totalEquipment,
      availableCount,
      inUseCount,
      needsRepairCount,
      discardedCount,
      equipmentByType: equipmentByTypeFormatted,
      recentEquipment,
      totalMaintenanceCost,
    };
  } catch (error) {
    console.error("Error fetching all departments stats:", error);
    throw error;
  }
}
