"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  loginSchema,
  signupSchema,
  type SignupInput,
} from "@/lib/validations/auth";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

export interface ActionResult {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Server action for user login
 */
export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid email or password format",
      };
    }

    // Attempt to sign in
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
          };
        default:
          return {
            success: false,
            message: "An error occurred during login",
          };
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Server action for user registration
 */
export async function signupAction(data: SignupInput): Promise<ActionResult> {
  try {
    // Validate input
    const validatedFields = signupSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, departmentId } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        departmentId,
        role: "DEPT_HEAD", // Default role
      },
    });

    return {
      success: true,
      message: "Account created successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

/**
 * Server action to verify user credentials (used for validation)
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid email or password format",
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      validatedFields.data.password,
      user.password
    );

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return {
      success: true,
      message: "Credentials verified",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Credential verification error:", error);
    return {
      success: false,
      message: "An error occurred during verification",
    };
  }
}

/**
 * Server action to get all departments for signup form
 */
export async function getDepartments(): Promise<ActionResult> {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        location: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: departments,
    };
  } catch (error) {
    console.error("Get departments error:", error);
    return {
      success: false,
      message: "Failed to fetch departments",
    };
  }
}
