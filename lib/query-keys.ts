/**
 * Centralized query keys for TanStack Query
 * This ensures consistent cache management across the application
 */

export const queryKeys = {
  // Dashboard stats
  dashboardStats: () => ["dashboard-stats"] as const,
  dashboardStatsByDepartment: (departmentId: string) =>
    ["dashboard-stats", departmentId] as const,
  allDepartmentsStats: () => ["dashboard-stats", "all-departments"] as const,

  // Equipment queries
  equipment: {
    all: () => ["equipment"] as const,
    allDepartments: () => ["equipment", "all-departments"] as const,
    byId: (id: string) => ["equipment", id] as const,
    byDepartment: (departmentId: string) =>
      ["equipment", "department", departmentId] as const,
    byStatus: (status: string) => ["equipment", "status", status] as const,
  },

  // Department queries
  departments: {
    all: () => ["departments"] as const,
    byId: (id: string) => ["departments", id] as const,
  },

  // Maintenance logs
  maintenanceLogs: {
    all: () => ["maintenance-logs"] as const,
    byEquipment: (equipmentId: string) =>
      ["maintenance-logs", equipmentId] as const,
  },

  // Users
  users: {
    all: () => ["users"] as const,
    byId: (id: string) => ["users", id] as const,
    byDepartment: (departmentId: string) =>
      ["users", "department", departmentId] as const,
  },
} as const;
