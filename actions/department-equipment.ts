"use server";

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
    // Department equipment data is public - no authentication required

    let equipment = [];

    // Fetch from the appropriate table based on tableType
    switch (tableType) {
      case "FoodAnalysisLabEquipment":
        console.log(
          "🔍 Fetching from FoodAnalysisLabEquipment table with departmentId:",
          departmentId
        );
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.foodAnalysisLabEquipment.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        console.log("🔍 Found equipment:", equipment.length, "items");
        break;

      case "AgronomyLabEquipment":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.agronomyLabEquipment.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "MRIAssets":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.mRIAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "AMRIInventory":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.aMRIInventory.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "FloricultureStationAssets":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.floricultureStationAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "SoilWaterTestingProject":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.soilWaterTestingProject.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "ERSSStockRegister":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.eRSSStockRegister.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "MNSUAMEstateFacilities":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.mNSUAMEstateFacilities.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "CRIMultanAssets":
        // @ts-ignore - Prisma client type issue
        equipment = await prisma.cRIMultanAssets.findMany({
          where: { departmentId },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "RARIBahawalpurAssets":
        // @ts-ignore - Prisma client type issue
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
      message: `An error occurred while fetching equipment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

/**
 * Get department ID by department slug/name
 */
export async function getDepartmentBySlug(slug: string): Promise<ActionResult> {
  try {
    // Department data is public - no authentication required

    // Map slug to department name
    const departmentNameMap: Record<string, string> = {
      "food-science-technology": "Food Science and Technology",
      agronomy: "Agronomy Department",
      "bhawalpur-agri":
        "Regional Agricultural Research Institute (RARI), Bahawalpur",
      "mango-research": "Mango Research Institute",
      "agricultural-mechanization":
        "Agricultural Mechanization Research Institute",
      "floriculture-research": "Floriculture Research Sub-station",
      "soil-water-testing": "Soil & Water Testing Laboratory",
      "entomology-research": "Entomology Research Sub-Station",
      "mnsuam-estate": "MNSUAM Estate & Facilities",
      "cotton-research-insititue": "Cotton Research Institute",
    };

    const departmentName = departmentNameMap[slug];
    if (!departmentName) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    console.log("🔍 Looking for department with name:", departmentName);
    const department = await prisma.department.findUnique({
      where: { name: departmentName },
    });
    console.log("🔍 Department found:", department);

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
