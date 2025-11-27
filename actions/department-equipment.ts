"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";

/**
 * Server action to get equipment for any department by table type
 */
export async function getDepartmentEquipment(
  departmentId: string,
  tableType: string
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    let equipment = [];

    // Fetch from the appropriate table based on tableType
    switch (tableType) {
      case "FoodAnalysisLabEquipment":
        equipment = await prisma.foodAnalysisLabEquipment.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "AgronomyLabEquipment":
        equipment = await prisma.agronomyLabEquipment.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "MRIAssets":
        equipment = await prisma.mRIAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "AMRIInventory":
        equipment = await prisma.aMRIInventory.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "FloricultureStationAssets":
        equipment = await prisma.floricultureStationAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "SoilWaterTestingProject":
        equipment = await prisma.soilWaterTestingProject.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "ERSSStockRegister":
        equipment = await prisma.eRSSStockRegister.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "MNSUAMEstateFacilities":
        equipment = await prisma.mNSUAMEstateFacilities.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "CRIMultanAssets":
        equipment = await prisma.cRIMultanAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "RARIBahawalpurAssets":
        equipment = await prisma.rARIBahawalpurAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      default:
        return {
          success: false,
          message: `Unknown table type: ${tableType}`,
        };
    }

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get department equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Get department ID by department slug/name
 */
export async function getDepartmentBySlug(slug: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Map slug to department name
    const departmentNameMap: Record<string, string> = {
      "food-science-technology": "Food Science and Technology",
      agronomy: "Agronomy Department",
      "mango-research": "Mango Research Institute",
      "agricultural-mechanization":
        "Agricultural Mechanization Research Institute",
      "floriculture-research": "Floriculture Research Sub-station",
      "soil-water-testing": "Soil & Water Testing Laboratory",
      "entomology-research": "Entomology Research Sub-Station",
      "mnsuam-estate": "MNSUAM Estate & Facilities",
    };

    const departmentName = departmentNameMap[slug];
    if (!departmentName) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    const department = await prisma.department.findUnique({
      where: { name: departmentName },
    });

    if (!department) {
      return {
        success: false,
        message: "Department not found in database",
      };
    }

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    console.error("Get department by slug error:", error);
    return {
      success: false,
      message: "An error occurred while fetching department",
    };
  }
}
