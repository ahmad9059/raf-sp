import { describe, it, expect, vi, beforeEach } from "vitest";
import { bulkImportEquipment } from "@/actions/equipment";
import { parseCSVFile } from "@/lib/file-parser";
import { prisma } from "@/lib/prisma";

// Mock the file parser
vi.mock("@/lib/file-parser", () => ({
  parseCSVFile: vi.fn(),
}));

describe("Bulk Import Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("bulkImportEquipment", () => {
    it("should successfully import valid CSV data for DEPT_HEAD", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
        ],
        totalRows: 1,
        errors: [],
      };

      const mockCreatedEquipment = {
        id: "eq-1",
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE",
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      // Mock Prisma transaction
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          equipment: {
            create: vi.fn().mockResolvedValue(mockCreatedEquipment),
          },
        });
      });
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Successfully imported 1 equipment records");
      expect(result.data).toEqual({
        success: true,
        imported: 1,
        failed: 0,
        errors: [],
      });
    });

    it("should successfully import valid CSV data for ADMIN with department selection", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockDepartment = {
        id: "dept-1",
        name: "Agriculture Department",
      };

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
        ],
        totalRows: 1,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(
        mockDepartment as any
      );
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      // Mock Prisma transaction
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          equipment: {
            create: vi.fn().mockResolvedValue({}),
          },
        });
      });
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      const formData = new FormData();
      formData.append("file", mockFile);
      formData.append("departmentId", "dept-1");

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(true);
      expect(result.data?.imported).toBe(1);
      expect(result.data?.failed).toBe(0);
    });

    it("should fail if no file is provided", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const formData = new FormData();
      // No file added

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("No file provided");
    });

    it("should fail with invalid file type", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(["invalid content"], "document.txt", {
        type: "text/plain",
      });

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Invalid file type. Only CSV files are allowed."
      );
    });

    it("should fail with file size too large", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      // Create a mock file that's too large (over 10MB)
      const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB
      const mockFile = new File([largeContent], "large.csv", {
        type: "text/csv",
      });

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("File size too large. Maximum size is 10MB.");
    });

    it("should handle CSV parsing errors", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(["invalid,csv,content"], "invalid.csv", {
        type: "text/csv",
      });

      const mockParseResult = {
        success: false,
        data: [],
        totalRows: 1,
        errors: [
          {
            row: 1,
            message: "Invalid CSV format",
          },
        ],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("File parsing failed");
      expect(result.data?.errors).toEqual([
        {
          row: 1,
          message: "Invalid CSV format",
        },
      ]);
    });

    it("should handle validation errors for individual records", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\n,Invalid Type,INVALID_STATUS,invalid-date",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "", // Invalid: empty name
            type: "Invalid Type",
            status: "INVALID_STATUS", // Invalid status
            purchaseDate: "invalid-date", // Invalid date
          },
        ],
        totalRows: 1,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      // Mock Prisma transaction
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          equipment: {
            create: vi.fn(),
          },
        });
      });
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(true); // Overall success, but with failures
      expect(result.data?.imported).toBe(0);
      expect(result.data?.failed).toBe(1);
      expect(result.data?.errors).toHaveLength(1);
      expect(result.data?.errors[0].row).toBe(1);
      expect(result.data?.errors[0].message).toContain("Validation failed");
    });

    it("should handle database errors during import", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
        ],
        totalRows: 1,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      // Mock Prisma transaction with database error
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          equipment: {
            create: vi
              .fn()
              .mockRejectedValue(new Error("Database connection failed")),
          },
        });
      });
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(true); // Overall success, but with failures
      expect(result.data?.imported).toBe(0);
      expect(result.data?.failed).toBe(1);
      expect(result.data?.errors).toHaveLength(1);
      expect(result.data?.errors[0].message).toContain(
        "Database error: Database connection failed"
      );
    });

    it("should fail if ADMIN does not provide department selection", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
        ],
        totalRows: 1,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      const formData = new FormData();
      formData.append("file", mockFile);
      // No departmentId provided

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Department selection is required for admin users"
      );
    });

    it("should fail if ADMIN selects invalid department", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "admin-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
        ],
        totalRows: 1,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(null); // Department not found
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      const formData = new FormData();
      formData.append("file", mockFile);
      formData.append("departmentId", "invalid-dept");

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid department selected");
    });

    it("should prevent unauthorized access", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized. Please log in.");
    });

    it("should handle mixed success and failure records", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockFile = new File(
        [
          "name,type,status,purchaseDate\nTractor,Heavy Machinery,AVAILABLE,2023-01-01\n,Invalid,INVALID,invalid",
        ],
        "equipment.csv",
        {
          type: "text/csv",
        }
      );

      const mockParseResult = {
        success: true,
        data: [
          {
            name: "Tractor",
            type: "Heavy Machinery",
            status: "AVAILABLE",
            purchaseDate: new Date("2023-01-01"),
          },
          {
            name: "", // Invalid
            type: "Invalid",
            status: "INVALID",
            purchaseDate: "invalid",
          },
        ],
        totalRows: 2,
        errors: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(parseCSVFile).mockResolvedValue(mockParseResult as any);

      // Mock Prisma transaction - first succeeds, second fails validation
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          equipment: {
            create: vi
              .fn()
              .mockResolvedValueOnce({})
              .mockRejectedValueOnce(new Error("Validation failed")),
          },
        });
      });
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await bulkImportEquipment(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain(
        "Import completed with 1 successful and 1 failed records"
      );
      expect(result.data?.imported).toBe(1);
      expect(result.data?.failed).toBe(1);
    });
  });
});
