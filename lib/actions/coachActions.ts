"use server";
import { prisma } from "@/lib/prisma";

// This file contains functions to talk to your database.
// We use "Server Actions" which are modern ways to handle data in Next.js.

/**
 * This function gets all the coaches from the database.
 */
export async function getAllCoaches() {
    try {
        // We tell Prisma to find many coaches in the "coach" table.
        // We also ask it to include the user's name and email.
        const coaches = await prisma.coach.findMany({
            include: {
                user: true,
            },
        });

        // We return the list of coaches to whoever called this function.
        return { success: true, data: coaches };
    } catch (error) {
        // If something goes wrong, we print the error to the console.
        console.error("Error fetching coaches:", error);
        // and return a failure message.
        return { success: false, error: "Could not fetch coaches" };
    }
}

/**
 * This function gets one single coach by their ID.
 */
export async function getCoachById(id: string) {
    try {
        // We look for a unique coach whose ID matches the one provided.
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        if (!coach) {
            return { success: false, error: "Coach not found" };
        }

        return { success: true, data: coach };
    } catch (error) {
        console.error("Error fetching coach:", error);
        return { success: false, error: "Could not fetch coach" };
    }
}

/**
 * This function creates a new booking in the database.
 */
export async function createBooking(data: {
    studentId: string;
    coachId: string;
    date: Date;
    time: string;
    duration: number;
    amount: number;
}) {
    try {
        // We tell Prisma to create a new record in the "booking" table.
        const booking = await prisma.booking.create({
            data: {
                studentId: data.studentId,
                coachId: data.coachId,
                date: data.date,
                time: data.time,
                duration: data.duration,
                amount: data.amount,
                status: "pending", // New bookings start as pending.
            },
        });

        return { success: true, data: booking };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Could not create booking" };
    }
}

/**
 * This function gets all the data for a coach's dashboard.
 */
export async function getCoachDashboardData(coachId: string) {
    try {
        // 1. Get the coach and their bookings
        const coach = await prisma.coach.findUnique({
            where: { id: coachId },
            include: {
                bookings: {
                    include: {
                        student: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'asc'
                    }
                }
            }
        });

        if (!coach) return { success: false, error: "Coach not found" };

        // 2. Calculate some stats
        const totalEarnings = coach.bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.amount, 0);

        const activeStudents = new Set(coach.bookings.map(b => b.studentId)).size;

        const upcomingLessons = coach.bookings.filter(b =>
            b.status === 'confirmed' && new Date(b.date) >= new Date()
        );

        const pendingRequests = coach.bookings.filter(b => b.status === 'pending');

        return {
            success: true,
            data: {
                stats: {
                    activeStudents,
                    weeklyLessons: upcomingLessons.length,
                    monthlyEarnings: totalEarnings,
                    rating: coach.stars
                },
                upcomingLessons,
                pendingRequests
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { success: false, error: "Could not fetch dashboard data" };
    }
}

/**
 * This function gets all the data for a student's dashboard.
 */
export async function getStudentDashboardData(studentId: string) {
    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                bookings: {
                    include: {
                        coach: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'asc'
                    }
                }
            }
        });

        if (!student) return { success: false, error: "Student not found" };

        const upcomingLessons = student.bookings.filter(b =>
            new Date(b.date) >= new Date()
        );

        const myCoachesRaw = student.bookings.map(b => b.coach);
        // Unique coaches
        const myCoaches = Array.from(new Map(myCoachesRaw.map(c => [c.id, c])).values());

        const totalHours = student.bookings
            .filter(b => b.status === 'confirmed' && b.date < new Date())
            .reduce((sum, b) => sum + (b.duration / 60), 0);

        return {
            success: true,
            data: {
                stats: {
                    rating: 1500, // Placeholder as we don't track student rating yet
                    totalLessons: student.bookings.length,
                    activeCoaches: myCoaches.length,
                    hoursLearned: totalHours
                },
                upcomingLessons,
                myCoaches
            }
        };
    } catch (error) {
        console.error("Error fetching student dashboard data:", error);
        return { success: false, error: "Could not fetch student dashboard data" };
    }
}
