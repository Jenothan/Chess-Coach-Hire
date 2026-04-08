"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * Gets the profile data for a user based on their ID.
 */
export async function getProfileData(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                coachProfile: true,
                studentProfile: true,
            }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        return { success: true, data: user };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return { success: false, error: "Failed to fetch profile data" };
    }
}

/**
 * Updates a coach's profile.
 */
export async function updateCoachProfile(userId: string, data: any) {
    try {
        const { name, image, title, hourlyRate, location, specialties, bio, experience, languages } = data;

        // Update User name & image
        await prisma.user.update({
            where: { id: userId },
            data: { name, image }
        });

        // Update Coach profile
        await prisma.coach.update({
            where: { userId },
            data: {
                title,
                hourlyRate: parseFloat(hourlyRate),
                location,
                specialties,
                bio,
                experience,
                languages
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating coach profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

/**
 * Updates a student's profile.
 */
export async function updateStudentProfile(userId: string, data: any) {
    try {
        const { name, image } = data;

        await prisma.user.update({
            where: { id: userId },
            data: { name, image }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating student profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

/**
 * Changes a user's password.
 */
export async function changePassword(userId: string, data: any) {
    try {
        const { currentPassword, newPassword } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.password) {
            return { success: false, error: "User not found" };
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { success: false, error: "Incorrect current password" };
        }

        // Hash and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return { success: true };
    } catch (error) {
        console.error("Error changing password:", error);
        return { success: false, error: "Failed to change password" };
    }
}

/**
 * Uploads a profile picture to the public/uploads directory.
 */
export async function uploadProfilePicture(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(process.cwd(), "public", "uploads", filename);

        await writeFile(path, buffer);
        console.log(`File saved to ${path}`);

        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        console.error("Error uploading file:", error);
        return { success: false, error: "Failed to upload file" };
    }
}
