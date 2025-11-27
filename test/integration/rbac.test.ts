import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "@/actions/equipment";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/actions/department";
import { getDashboardStats } from "@/actions/stats";
import { prisma } from "@/lib/prisma";

describe("Role-Based Access Control Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ADMIN Role Access", () => {
    const adminSession = {
      user: {
        id: "admin-1",
        role: "ADMIN",
        departmentId: null,
      },
    };

    it("should allow ADMIN to create equipment for any department", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(adminSession as any);

      const mockDepartment = { id: "dept-1", name: "Agriculture Department" };
      const mockEquipment = {
        id: "eq-1",
        name: "Tractor",
        departmentId: "dept-1",
        department: { name: "Agriculture Department" },
      };

      vi.mocked(prisma.department.findUnique).mockResolvedValue(
        mockDepartment as any
      );
      vi.mocked(prisma.equipment.create).mockResolvedValue(
        mockEquipment as any
      );

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE" as const,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment created successfully");
    });

    it("should allow ADMIN to update equipment from any department", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(adminSession as any);

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2",
        department: { name: "Other Department" },
      };

      const mockUpdatedEquipment = {
        ...mockExistingEquipment,
        name: "Updated Tractor",
        department: { name: "Other Department" },
      };

      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );
      vi.mocked(prisma.equipment.update).mockResolvedValue(
        mockUpdatedEquipment as any
      );

      const result = await updateEquipment("eq-1", { name: "Updated Tractor" });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment updated successfully");
    });

    it("should allow ADMIN to delete equipment from any department", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(adminSession as any);

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2",
        maintenanceLogs: [],
      };

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

    it("should allow ADMIN to create departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(adminSession as any);

      const mockDepartment = {
        id: "dept-1",
        name: "New Department",
        location: "Building A",
        logo: null,
      };

      vi.mocked(prisma.department.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.department.create).mockResolvedValue(
        mockDepartment as any
      );

      const departmentData = {
        name: "New Department",
        location: "Building A",
      };

      const result = await createDepartment(departmentData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Department created successfully");
    });

    it("should allow ADMIN to view global dashboard stats", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(adminSession as any);

      const mockStats = {
        totalEquipment: 100,
        availableCount: 80,
        inUseCount: 15,
        needsRepairCount: 5,
        discardedCount: 0,
        equipmentByType: [
          { type: "Heavy Machinery", count: 50 },
          { type: "Tools", count: 50 },
        ],
        recentEquipment: [],
        totalMaintenanceCost: 5000,
      };

      // Mock all the Prisma calls that getDashboardStats makes
      vi.mocked(prisma.equipment.count).mockResolvedValue(100);
      vi.mocked(prisma.equipment.findMany).mockResolvedValue([]);
      vi.mocked(prisma.equipment.groupBy).mockResolvedValue([
        { type: "Heavy Machinery", _count: { type: 50 } },
        { type: "Tools", _count: { type: 50 } },
      ] as any);
      vi.mocked(prisma.maintenanceLog.aggregate).mockResolvedValue({
        _sum: { cost: 5000 },
      } as any);

      const result = await getDashboardStats();

      expect(result).toBeDefined();
      expect(result.totalEquipment).toBe(100);
    });
  });

  describe("DEPT_HEAD Role Access", () => {
    const deptHeadSession = {
      user: {
        id: "dept-head-1",
        role: "DEPT_HEAD",
        departmentId: "dept-1",
      },
    };

    it("should allow DEPT_HEAD to create equipment only for their department", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const mockDepartment = { id: "dept-1", name: "Agriculture Department" };
      const mockEquipment = {
        id: "eq-1",
        name: "Tractor",
        departmentId: "dept-1",
        department: { name: "Agriculture Department" },
      };

      vi.mocked(prisma.department.findUnique).mockResolvedValue(
        mockDepartment as any
      );
      vi.mocked(prisma.equipment.create).mockResolvedValue(
        mockEquipment as any
      );

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE" as const,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1", // Same as user's department
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Equipment created successfully");
    });

    it("should prevent DEPT_HEAD from creating equipment for other departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE" as const,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-2", // Different department
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only create equipment for your own department"
      );
    });

    it("should prevent DEPT_HEAD from updating equipment from other departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2", // Different department
        department: { name: "Other Department" },
      };

      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );

      const result = await updateEquipment("eq-1", { name: "Updated Name" });

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only update equipment from your own department"
      );
    });

    it("should prevent DEPT_HEAD from deleting equipment from other departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const mockExistingEquipment = {
        id: "eq-1",
        departmentId: "dept-2", // Different department
        maintenanceLogs: [],
      };

      vi.mocked(prisma.equipment.findUnique).mockResolvedValue(
        mockExistingEquipment as any
      );

      const result = await deleteEquipment("eq-1");

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "You can only delete equipment from your own department"
      );
    });

    it("should prevent DEPT_HEAD from creating departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const departmentData = {
        name: "New Department",
        location: "Building A",
      };

      const result = await createDepartment(departmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Access denied. Admin privileges required.");
    });

    it("should prevent DEPT_HEAD from updating departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const result = await updateDepartment("dept-1", { name: "Updated Name" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Access denied. Admin privileges required.");
    });

    it("should prevent DEPT_HEAD from deleting departments", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      const result = await deleteDepartment("dept-1");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Access denied. Admin privileges required.");
    });

    it("should allow DEPT_HEAD to view department-specific dashboard stats", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(deptHeadSession as any);

      // Mock Prisma calls with department filtering
      vi.mocked(prisma.equipment.count).mockResolvedValue(20);
      vi.mocked(prisma.equipment.findMany).mockResolvedValue([]);
      vi.mocked(prisma.equipment.groupBy).mockResolvedValue([
        { type: "Heavy Machinery", _count: { type: 10 } },
        { type: "Tools", _count: { type: 10 } },
      ] as any);
      vi.mocked(prisma.maintenanceLog.aggregate).mockResolvedValue({
        _sum: { cost: 1000 },
      } as any);

      const result = await getDashboardStats("dept-1");

      expect(result).toBeDefined();
      expect(result.totalEquipment).toBe(20);
    });
  });

  describe("Unauthenticated Access", () => {
    it("should prevent unauthenticated users from accessing equipment actions", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE" as const,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const createResult = await createEquipment(equipmentData);
      expect(createResult.success).toBe(false);
      expect(createResult.message).toBe("Unauthorized. Please log in.");

      const updateResult = await updateEquipment("eq-1", { name: "Updated" });
      expect(updateResult.success).toBe(false);
      expect(updateResult.message).toBe("Unauthorized. Please log in.");

      const deleteResult = await deleteEquipment("eq-1");
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.message).toBe("Unauthorized. Please log in.");
    });

    it("should prevent unauthenticated users from accessing department actions", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const departmentData = {
        name: "New Department",
        location: "Building A",
      };

      const createResult = await createDepartment(departmentData);
      expect(createResult.success).toBe(false);
      expect(createResult.message).toBe("Unauthorized. Please log in.");

      const updateResult = await updateDepartment("dept-1", {
        name: "Updated",
      });
      expect(updateResult.success).toBe(false);
      expect(updateResult.message).toBe("Unauthorized. Please log in.");

      const deleteResult = await deleteDepartment("dept-1");
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.message).toBe("Unauthorized. Please log in.");
    });

    it("should prevent unauthenticated users from accessing dashboard stats", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(null);

      await expect(getDashboardStats()).rejects.toThrow("Unauthorized");
    });
  });

  describe("Department Head without Department Assignment", () => {
    const unassignedDeptHeadSession = {
      user: {
        id: "dept-head-2",
        role: "DEPT_HEAD",
        departmentId: null, // Not assigned to any department
      },
    };

    it("should prevent unassigned DEPT_HEAD from creating equipment", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(unassignedDeptHeadSession as any);

      const equipmentData = {
        name: "Tractor",
        type: "Heavy Machinery",
        status: "AVAILABLE" as const,
        purchaseDate: new Date("2023-01-01"),
        departmentId: "dept-1",
      };

      const result = await createEquipment(equipmentData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Department head must be assigned to a department"
      );
    });

    it("should prevent unassigned DEPT_HEAD from accessing dashboard stats", async () => {
      const { auth } = await import("@/auth");
      vi.mocked(auth).mockResolvedValue(unassignedDeptHeadSession as any);

      await expect(getDashboardStats()).rejects.toThrow(
        "Department head must be assigned to a department"
      );
    });
  });
});
