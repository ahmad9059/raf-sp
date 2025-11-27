"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  equipmentSchema,
  type EquipmentInput,
} from "@/lib/validations/equipment";
import { ActionResult, BulkImportResult } from "@/types";
import { revalidatePath } from "next/cache";
import { parseCSVFile } from "@/lib/file-parser";

/**
 * Server action to create a new equipment record
 * Requirements: 4.1, 4.2, 4.4
 */
export async function createEquipment(
  data: EquipmentInput
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
    const validatedFields = equipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, type, status, purchaseDate, imageUrl, departmentId } =
      validatedFields.data;

    // Authorization check: DEPT_HEAD can only create equipment for their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only create equipment for your own department",
        };
      }
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return {
        success: false,
        message: "Invalid department selected",
      };
    }

    // Create equipment
    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        status,
        purchaseDate,
        imageUrl: imageUrl || null,
        departmentId,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      message: "Equipment created successfully",
      data: equipment,
    };
  } catch (error) {
    console.error("Create equipment error:", error);
    return {
      success: false,
      message: "An error occurred while creating equipment",
    };
  }
}

/**
 * Server action to update an existing equipment record
 * Requirements: 4.2, 4.3
 */
export async function updateEquipment(
  id: string,
  data: Partial<EquipmentInput>
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

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only update equipment from their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (existingEquipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only update equipment from your own department",
        };
      }

      // DEPT_HEAD cannot change departmentId
      if (data.departmentId && data.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You cannot transfer equipment to another department",
        };
      }
    }

    // Validate input (partial validation for updates)
    const validatedFields = equipmentSchema.partial().safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    // If departmentId is being changed, verify the new department exists
    if (
      validatedFields.data.departmentId &&
      validatedFields.data.departmentId !== existingEquipment.departmentId
    ) {
      const newDepartment = await prisma.department.findUnique({
        where: { id: validatedFields.data.departmentId },
      });

      if (!newDepartment) {
        return {
          success: false,
          message: "Invalid department selected",
        };
      }
    }

    // Update equipment
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: {
        ...validatedFields.data,
        imageUrl: validatedFields.data.imageUrl || existingEquipment.imageUrl,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${id}`);

    return {
      success: true,
      message: "Equipment updated successfully",
      data: updatedEquipment,
    };
  } catch (error) {
    console.error("Update equipment error:", error);
    return {
      success: false,
      message: "An error occurred while updating equipment",
    };
  }
}

/**
 * Server action to delete an equipment record
 * Requirements: 4.3
 */
export async function deleteEquipment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceLogs: true,
      },
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only delete equipment from their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (existingEquipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only delete equipment from your own department",
        };
      }
    }

    // Delete equipment (cascade will handle maintenance logs)
    await prisma.equipment.delete({
      where: { id },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      message: "Equipment deleted successfully",
    };
  } catch (error) {
    console.error("Delete equipment error:", error);
    return {
      success: false,
      message: "An error occurred while deleting equipment",
    };
  }
}

/**
 * Server action to get a single equipment record by ID
 */
export async function getEquipmentById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        maintenanceLogs: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!equipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only view equipment from their department
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
          message: "You can only view equipment from your own department",
        };
      }
    }

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Server action to get all equipment with optional filtering
 */
export async function getEquipment(filters?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Build where clause
    const whereClause: any = {};

    // Role-based filtering
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }
      whereClause.departmentId = userDepartmentId;
    }

    // Apply filters
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { type: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const equipment = await prisma.equipment.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            name: true,
          },
        },
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
    console.error("Get equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Server action to get all equipment across all departments (for viewing)
 */
export async function getAllEquipment(filters?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Build where clause (no department filtering for viewing)
    const whereClause: any = {};

    // Apply filters
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { type: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const equipment = await prisma.equipment.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ department: { name: "asc" } }, { createdAt: "desc" }],
    });

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get all equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Server action to bulk import equipment from CSV or PDF files
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export async function bulkImportEquipment(
  formData: FormData
): Promise<ActionResult<BulkImportResult>> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Get the uploaded file
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel", // .csv files sometimes have this MIME type
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.toLowerCase().endsWith(".csv")
    ) {
      return {
        success: false,
        message: "Invalid file type. Only CSV files are allowed.",
      };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size too large. Maximum size is 10MB.",
      };
    }

    // Parse the CSV file
    const parseResult = await parseCSVFile(file);

    if (!parseResult.success && parseResult.errors.length > 0) {
      return {
        success: false,
        message: "File parsing failed",
        data: {
          success: false,
          imported: 0,
          failed: parseResult.totalRows,
          errors: parseResult.errors,
        },
      };
    }

    // Determine target department
    let targetDepartmentId: string;

    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }
      targetDepartmentId = userDepartmentId;
    } else {
      // For ADMIN, get department from form data or use first available
      const departmentId = formData.get("departmentId") as string;

      if (departmentId) {
        // Verify department exists
        const department = await prisma.department.findUnique({
          where: { id: departmentId },
        });

        if (!department) {
          return {
            success: false,
            message: "Invalid department selected",
          };
        }

        targetDepartmentId = departmentId;
      } else {
        return {
          success: false,
          message: "Department selection is required for admin users",
        };
      }
    }

    // Process valid equipment records
    const importResults: BulkImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
    };

    // Use transaction for bulk insert
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < parseResult.data.length; i++) {
        const equipmentData = parseResult.data[i];

        try {
          // Add department ID to the equipment data
          const completeEquipmentData = {
            ...equipmentData,
            departmentId: targetDepartmentId,
          };

          // Validate the complete data
          const validatedData = equipmentSchema.safeParse(
            completeEquipmentData
          );

          if (!validatedData.success) {
            importResults.failed++;
            importResults.errors.push({
              row: i + 1,
              message: `Validation failed: ${validatedData.error.issues
                .map((e) => e.message)
                .join(", ")}`,
            });
            continue;
          }

          // Create equipment record
          await tx.equipment.create({
            data: {
              name: validatedData.data.name,
              type: validatedData.data.type,
              status: validatedData.data.status,
              purchaseDate: validatedData.data.purchaseDate,
              imageUrl: validatedData.data.imageUrl || null,
              departmentId: validatedData.data.departmentId,
            },
          });

          importResults.imported++;
        } catch (error) {
          importResults.failed++;
          importResults.errors.push({
            row: i + 1,
            message: `Database error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
        }
      }
    });

    // Add parsing errors to the final result
    importResults.errors.push(...parseResult.errors);
    importResults.failed += parseResult.errors.length;

    // Update success status
    importResults.success = importResults.failed === 0;

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    const message = importResults.success
      ? `Successfully imported ${importResults.imported} equipment records`
      : `Import completed with ${importResults.imported} successful and ${importResults.failed} failed records`;

    return {
      success: true,
      message,
      data: importResults,
    };
  } catch (error) {
    console.error("Bulk import error:", error);
    return {
      success: false,
      message: "An error occurred during bulk import",
      data: {
        success: false,
        imported: 0,
        failed: 0,
        errors: [
          {
            row: 0,
            message: `System error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      },
    };
  }
}
