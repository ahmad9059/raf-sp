import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
  getEquipment,
} from "@/actions/equipment";
import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";

describe("Equipment CRUD Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createEquipment", () => {
    it("should create equipment successfully for DEPT_HEAD", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockDepartment = {
        id: "dept-1",
        name: "Agriculture Department",
      };

      const mockEquipment = {
        id: "eq-1",
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE",
        purchaseDate: new Date("2023-01-01"),
        imageUrl: null,
        departmentId: "dept-1",
        department: { name: "Agriculture Department" },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(
        mockDepartment as any
      );
      vi.mocked(prisma.equipment.create).mockResolvedValue(
        mockEquipment as any
      );

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: EquipmentStatus.AVAILABLE,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment created successfully");
      expect(result.data).toEqual(mockEquipment);
    });

    it("should fail if user is not authenticated", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: EquipmentStatus.AVAILABLE,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized. Please log in.");
    });

    it("should fail if DEPT_HEAD tries to create equipment for another department", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: EquipmentStatus.AVAILABLE,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-2", // Different department
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only create equipment for your own department"
      );
    });

    it("should fail if department does not exist", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(null);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: EquipmentStatus.AVAILABLE,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "invalid-dept",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid department selected");
    });

    it("should validate input data", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const equipmentData = {
        name: "", // Invalid: empty name
        type: "Heavy Machinery",
        status: EquipmentStatus.AVAILABLE,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid input data");
      expect(result.data).toBeDefined();
    });
  });

  describe("updateEquipment", () => {
    it("should update equipment successfully", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockExistingEquipment = {
        id: "eq-1",
        name: "Old Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE",
        departmentId: "dept-1",
        imageUrl: null,
        department: { name: "Agriculture Department" },
      };

      const mockUpdatedEquipment = {
        ...mockExistingEquipment,
        name: "New Tractor",
        department: { name: "Agriculture Department" },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );
      vi.mocked(prisma.equipment.update).mockResolvedValue(
        mockUpdatedEquipment as any
      );

      const updateData = {
        name: "New Tractor",
      };

      const result = await updateEquipment("eq-1", updateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment updated successfully");
      expect(result.data).toEqual(mockUpdatedEquipment);
    });

    it("should fail if equipment does not exist", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(null);

      const result = await updateEquipment("invalid-id", { name: "New Name" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Equipment not found");
    });

    it("should fail if DEPT_HEAD tries to update equipment from another department", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2", // Different department
        department: { name: "Other Department" },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );

      const result = await updateEquipment("eq-1", { name: "New Name" });

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only update equipment from your own department"
      );
    });
  });

  describe("deleteEquipment", () => {
    it("should delete equipment successfully", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-1",
        maintenanceLogs: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );
      vi.mocked(prisma.equipment.delete).mockResolvedValue(
        mockExistingEquipment as any
      );

      const result = await deleteEquipment("eq-1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment deleted successfully");
    });

    it("should fail if equipment does not exist", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(null);

      const result = await deleteEquipment("invalid-id");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Equipment not found");
    });

    it("should fail if DEPT_HEAD tries to delete equipment from another department", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2", // Different department
        maintenanceLogs: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );

      const result = await deleteEquipment("eq-1");

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only delete equipment from your own department"
      );
    });
  });

  describe("getEquipmentById", () => {
    it("should get equipment by ID successfully", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockEquipment = {
        id: "eq-1",
        name: "Tractor",
        departmentId: "dept-1",
        department: {
          id: "dept-1",
          name: "Agriculture Department",
          location: "Main Building",
        },
        maintenanceLogs: [],
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockEquipment as any
      );

      const result = await getEquipmentById("eq-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEquipment);
    });

    it("should fail if equipment does not exist", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(null);

      const result = await getEquipmentById("invalid-id");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Equipment not found");
    });
  });

  describe("getEquipment", () => {
    it("should get all equipment for ADMIN", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      const mockEquipment = [
        {
          id: "eq-1",
          name: "Tractor",
          department: { name: "Agriculture Department" },
        },
        {
          id: "eq-2",
          name: "Harvester",
          department: { name: "Livestock Department" },
        },
      ];

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findMany).mockResolvedValue(
        mockEquipment as any
      );

      const result = await getEquipment();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEquipment);
    });

    it("should get department-specific equipment for DEPT_HEAD", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "DEPT_HEAD",
          departmentId: "dept-1",
        },
      };

      const mockEquipment = [
        {
          id: "eq-1",
          name: "Tractor",
          department: { name: "Agriculture Department" },
        },
      ];

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findMany).mockResolvedValue(
        mockEquipment as any
      );

      const result = await getEquipment();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEquipment);
      expect(prisma.equipment.findMany).toHaveBeenCalledWith({
        where: { departmentId: "dept-1" },
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
    });

    it("should apply filters correctly", async () => {
      const { auth } = await import("@/auth");
      const mockSession = {
        user: {
          id: "user-1",
          role: "ADMIN",
          departmentId: null,
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.equipment.findMany).mockResolvedValue([]);

      const filters = {
        status: "AVAILABLE",
        type: "Heavy Machinery",
        search: "tractor",
      };

      await getEquipment(filters);

      expect(prisma.equipment.findMany).toHaveBeenCalledWith({
        where: {
          status: "AVAILABLE",
          type: "Heavy Machinery",
          OR: [
            { name: { contains: "tractor", mode: "insensitive" } },
            { type: { contains: "tractor", mode: "insensitive" } },
          ],
        },
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
    });
  });
});
