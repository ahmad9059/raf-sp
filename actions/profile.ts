"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import {
  profileUpdateSchema,
  passwordChangeSchema,
  type ProfileUpdateInput,
  type PasswordChangeInput,
} from "@/lib/validations/profile";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

/**
 * Server action to get current user profile
 */
export async function getCurrentUserProfile(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
            logo: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Get user profile error:", error);
    return {
      success: false,
      message: "An error occurred while fetching profile",
    };
  }
}

/**
 * Server action to update user profile (name, email)
 */
export async function updateUserProfile(
  data: ProfileUpdateInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedFields = profileUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email } = validatedFields.data;

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          success: false,
          message: "Email is already taken by another user",
        };
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
            logo: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    // Return updated user data without password
    const { password, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      message: "Profile updated successfully",
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Update user profile error:", error);
    return {
      success: false,
      message: "An error occurred while updating profile",
    };
  }
}

/**
 * Server action to change user password
 */
export async function changeUserPassword(
  data: PasswordChangeInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedFields = passwordChangeSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "An error occurred while changing password",
    };
  }
}

/**
 * Server action to update user profile image
 */
export async function updateUserProfileImage(
  imageUrl: string
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Update user profile image
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
            logo: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    // Return updated user data without password
    const { password, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      message: "Profile image updated successfully",
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Update profile image error:", error);
    return {
      success: false,
      message: "An error occurred while updating profile image",
    };
  }
}
