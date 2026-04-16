"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * This action registers a new user and creates their profile.
 */
export async function registerUser(data: any) {
    try {
        const { name, email, password, role } = data;

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role.toUpperCase(),
            }
        });

        // 3. Create the profile based on role
        if (role === 'coach') {
            await prisma.coach.create({
                data: {
                    userId: user.id,
                    title: "New Coach",
                    rating: 0,
                    hourlyRate: 20,
                    monthlyRate: 80,
                    location: "Not specified",
                    experience: "New coach",
                    specialties: ["General"],
                    languages: ["English"],
                    status: "PENDING"
                }
            });
        } else if (role === 'student') {
            await prisma.student.create({
                data: {
                    userId: user.id,
                }
            });
        }

        return { success: true, data: user };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Something went wrong during registration" };
    }
}

/**
 * This action logs in a user by checking their email and password.
 */
export async function loginUser(data: any) {
    try {
        const { email, password } = data;

        // 1. Find the user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                coachProfile: true,
                studentProfile: true,
            }
        });

        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }

        // 2. Verify password
        let isPasswordValid = false;

        if (user.password) {
            // First try bcrypt comparison
            isPasswordValid = await bcrypt.compare(password, user.password);

            // If bcrypt fails, check if it's a plain text match
            // We only do this if the stored password doesn't look like a bcrypt hash
            // (Bcrypt hashes start with $2a$, $2b$, or $2y$)
            if (!isPasswordValid && !user.password.startsWith('$2')) {
                if (password === user.password) {
                    isPasswordValid = true;

                    // Automatically hash and update the password in DB
                    console.log(`Auto-hashing plain text password for user: ${email}`);
                    const newHashedPassword = await bcrypt.hash(password, 10);
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { password: newHashedPassword }
                    });
                }
            }
        }

        if (!isPasswordValid) {
            return { success: false, error: "Invalid email or password" };
        }

        // Return user info
        return { success: true, data: user };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Something went wrong during login" };
    }
}
