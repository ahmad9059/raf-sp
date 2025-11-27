import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loginAction,
  signupAction,
  verifyCredentials,
  getDepartments,
} from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Mock the auth module
vi.mock("@/auth", () => ({
  signIn: vi.fn(),
}));

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginAction", () => {
    it("should successfully login with valid credentials", async () => {
      const { signIn } = await import("@/auth");
      vi.mocked(signIn).mockResolvedValue(undefined);

      const result = await loginAction("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful");
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });

    it("should fail with invalid email format", async () => {
      const result = await loginAction("invalid-email", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email or password format");
    });

    it("should fail with empty password", async () => {
      const result = await loginAction("test@example.com", "");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email or password format");
    });

    it("should handle authentication errors", async () => {
      const { signIn } = await import("@/auth");
      const { AuthError } = await import("next-auth");
      const authError = new AuthError("CredentialsSignin", "CredentialsSignin");
      vi.mocked(signIn).mockRejectedValue(authError);

      const result = await loginAction("test@example.com", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email or password");
    });
  });

  describe("signupAction", () => {
    it("should successfully create a new user", async () => {
      const mockDepartment = {
        id: "dept-1",
        name: "Agriculture Department",
        location: "Main Building",
      };

      const mockUser = {
        id: "user-1",
        email: "newuser@example.com",
        name: "New User",
        departmentId: "dept-1",
        role: "DEPT_HEAD",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(mockDepartment);
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);

      const signupData = {
        name: "New User",
        email: "newuser@example.com",
        password: "Password123",
        departmentId: "dept-1",
      };

      const result = await signupAction(signupData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Account created successfully");
      expect(result.data).toEqual({
        id: "user-1",
        email: "newuser@example.com",
      });
    });

    it("should fail if user already exists", async () => {
      const existingUser = {
        id: "user-1",
        email: "existing@example.com",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);

      const signupData = {
        name: "New User",
        email: "existing@example.com",
        password: "Password123",
        departmentId: "dept-1",
      };

      const result = await signupAction(signupData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("User with this email already exists");
    });

    it("should fail if department does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.department.findUnique).mockResolvedValue(null);

      const signupData = {
        name: "New User",
        email: "newuser@example.com",
        password: "Password123",
        departmentId: "invalid-dept",
      };

      const result = await signupAction(signupData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid department selected");
    });

    it("should validate input data", async () => {
      const signupData = {
        name: "",
        email: "invalid-email",
        password: "123", // Too short
        departmentId: "",
      };

      const result = await signupAction(signupData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid input data");
      expect(result.data).toBeDefined();
    });
  });

  describe("verifyCredentials", () => {
    it("should verify valid credentials", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        role: "DEPT_HEAD",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await verifyCredentials("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Credentials verified");
      expect(result.data).toEqual({
        id: "user-1",
        email: "test@example.com",
        role: "DEPT_HEAD",
      });
    });

    it("should fail with invalid password", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        role: "DEPT_HEAD",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await verifyCredentials(
        "test@example.com",
        "wrongpassword"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should fail if user does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await verifyCredentials(
        "nonexistent@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });
  });

  describe("getDepartments", () => {
    it("should return all departments", async () => {
      const mockDepartments = [
        {
          id: "dept-1",
          name: "Agriculture Department",
          location: "Main Building",
        },
        {
          id: "dept-2",
          name: "Livestock Department",
          location: "Farm Complex",
        },
      ];

      vi.mocked(prisma.department.findMany).mockResolvedValue(
        mockDepartments as any
      );

      const result = await getDepartments();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          location: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    it("should handle database errors", async () => {
      vi.mocked(prisma.department.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getDepartments();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Failed to fetch departments");
    });
  });
});
