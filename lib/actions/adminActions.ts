"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminDashboardData() {
    try {
        const [totalCoaches, totalStudents, totalBookings, recentBookings, pendingCoaches] = await Promise.all([
            prisma.coach.count(),
            prisma.student.count(),
            prisma.booking.count(),
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    student: { include: { user: true } },
                    coach: { include: { user: true } }
                }
            }),
            prisma.coach.findMany({
                where: { status: 'PENDING' } as any,
                take: 5,
                include: { user: true }
            })
        ]);

        // Mocking revenue and chart data for now as we don't have a full transactions system
        // but we can calculate current month revenue from bookings if we have amounts
        const revenueResult = await prisma.booking.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: {
                    // Start of current month
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        // Coach distribution
        const activeCount = await prisma.coach.count({ where: { status: 'ACTIVE' } as any });
        const pendingCount = await prisma.coach.count({ where: { status: 'PENDING' } as any });
        const suspendedCount = await prisma.coach.count({ where: { status: 'SUSPENDED' } as any });

        return {
            stats: {
                totalCoaches,
                totalStudents,
                totalBookings,
                revenueMTD: revenueResult._sum.amount || 0
            },
            recentBookings: recentBookings.map((b: any) => ({
                id: b.id,
                student: b.student?.user?.name || 'Unknown',
                coach: b.coach?.user?.name || 'Unknown',
                date: b.date.toISOString().split('T')[0],
                amount: `$${b.amount}`,
                status: b.status
            })),
            recentCoaches: pendingCoaches.map((c: any) => ({
                id: c.id,
                name: c.user?.name || 'Unknown',
                rating: c.rating,
                status: 'pending',
                date: new Date().toISOString().split('T')[0] // Placeholder for joined date if not in schema
            })),
            coachDistribution: [
                { name: 'Active', value: activeCount, color: '#4CAF50' },
                { name: 'Pending', value: pendingCount, color: '#FFA500' },
                { name: 'Suspended', value: suspendedCount, color: '#FF4444' },
            ]
        };
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        throw new Error("Failed to fetch dashboard data");
    }
}

export async function getCoachesData() {
    try {
        const coaches = await prisma.coach.findMany({
            include: { user: true }
        });

        return coaches.map((c: any) => ({
            id: c.id,
            name: c.user?.name || 'Unknown',
            email: c.user?.email || 'N/A',
            rating: c.rating,
            specialty: c.specialties[0] || 'General',
            status: c.status ? (c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase()) : 'Pending',
            students: 0, // Need to calculate student count later
            joinedDate: new Date().toISOString().split('T')[0], // Placeholder
        }));
    } catch (error) {
        console.error("Error fetching coaches data:", error);
        throw new Error("Failed to fetch coaches");
    }
}

export async function getBookingsData() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                student: { include: { user: true } },
                coach: { include: { user: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return bookings.map((b: any) => ({
            id: b.id,
            student: b.student?.user?.name || 'Unknown',
            coach: b.coach?.user?.name || 'Unknown',
            date: b.date.toISOString(),
            duration: b.duration,
            status: b.status ? (b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()) : 'Pending',
            amount: b.amount,
            topic: b.type === 'single' ? 'Standard Lesson' : 'Package Lesson'
        }));
    } catch (error) {
        console.error("Error fetching bookings data:", error);
        throw new Error("Failed to fetch bookings");
    }
}

export async function updateCoachStatus(coachId: string, status: string) {
    try {
        await prisma.coach.update({
            where: { id: coachId },
            data: { status } as any
        });
        revalidatePath("/admin");
        revalidatePath("/admin/coaches");
        revalidatePath("/coach");
        return { success: true };
    } catch (error) {
        console.error("Error updating coach status:", error);
        return { success: false, error: "Failed to update coach status" };
    }
}

export async function getStudentsData() {
    try {
        const students = await prisma.student.findMany({
            include: { user: true }
        });

        return students.map((s: any) => ({
            id: s.id,
            name: s.user?.name || 'Unknown',
            email: s.user?.email || 'N/A',
            rating: s.rating,
            lessonsCompleted: s.lessonsCompleted,
            joinedDate: s.joinedDate.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching students data:", error);
        throw new Error("Failed to fetch students");
    }
}
