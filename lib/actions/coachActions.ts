"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notificationActions";

// This file contains functions to talk to your database.
// We use "Server Actions" which are modern ways to handle data in Next.js.

/**
 * This function gets all the coaches from the database.
 */
export async function getAllCoaches() {
    try {
        // We tell Prisma to find many coaches in the "coach" table.
        const coaches = await prisma.coach.findMany({
            include: {
                user: true,
                slots: true
            },
        });

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
            include: {
                coach: { include: { user: true } },
                student: { include: { user: true } }
            }
        });

        // Create notification for coach
        if (booking.coach.userId) {
            await createNotification(
                booking.coach.userId,
                "BOOKING_REQUEST",
                `New lesson request from ${booking.student.user.name} for ${new Date(data.date).toLocaleDateString()}`,
                "/coach"
            );
        }

        return { success: true, data: booking };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Could not create booking" };
    }
}

/**
 * This function gets all the data for a coach's dashboard.
 */
export async function getCoachDashboardData(id: string) {
    try {
        // 1. Get the coach and their bookings
        // Try userId first
        let coach = await prisma.coach.findUnique({
            where: { userId: id },
            include: {
                slots: true,
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

        // If not found by userId, try profile id directly
        if (!coach) {
            coach = await prisma.coach.findUnique({
                where: { id: id },
                include: {
                    slots: true,
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
        }

        if (!coach) return { success: false, error: "Coach not found" };

        const coachData = coach as any;

        // 2. Calculate some stats
        const totalEarnings = coachData.bookings
            .filter((b: any) => b.status === 'confirmed')
            .reduce((sum: number, b: any) => sum + b.amount, 0);

        const activeStudents = new Set(coachData.bookings.map((b: any) => b.studentId)).size;

        const upcomingLessons = coachData.bookings.filter((b: any) =>
            b.status === 'confirmed' && new Date(b.date) >= new Date()
        );

        const pendingRequests = coachData.bookings.filter((b: any) => b.status === 'pending');

        console.log(`FETCHED COACH DATA for user ${id}: status = ${coach.status}`);

        return {
            success: true,
            data: {
                stats: {
                    activeStudents,
                    weeklyLessons: upcomingLessons.length,
                    monthlyEarnings: totalEarnings,
                    rating: coachData.stars
                },
                upcomingLessons,
                pendingRequests,
                slots: coachData.slots,
                status: coachData.status,
                hourlyRate: coachData.hourlyRate
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

/**
 * Adds a new availability slot for a coach.
 */
export async function addSlot(id: string, data: { day: string; startTime: string; endTime: string }) {
    try {
        // Try to find the coach by userId first (since the frontend often passes userId)
        let coach = await (prisma as any).coach.findUnique({
            where: { userId: id }
        });

        // if not found by userId, try to find by coach profile id directly
        if (!coach) {
            coach = await (prisma as any).coach.findUnique({
                where: { id: id }
            });
        }

        if (!coach) {
            return { success: false, error: "Coach not found" };
        }

        const slot = await (prisma as any).availabilitySlot.create({
            data: {
                coachId: coach.id,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                isBusy: false
            }
        });
        return { success: true, data: slot };
    } catch (error) {
        console.error("Error adding slot:", error);
        return { success: false, error: "Could not add slot" };
    }
}

/**
 * Removes an availability slot.
 */
export async function removeSlot(slotId: string) {
    try {
        await (prisma as any).availabilitySlot.delete({
            where: { id: slotId }
        });
        return { success: true };
    } catch (error) {
        console.error("Error removing slot:", error);
        return { success: false, error: "Could not remove slot" };
    }
}

/**
 * Toggles the busy status of a slot.
 */
export async function toggleSlotBusy(slotId: string, isBusy: boolean) {
    try {
        await (prisma as any).availabilitySlot.update({
            where: { id: slotId },
            data: { isBusy }
        });
        return { success: true };
    } catch (error) {
        console.error("Error toggling slot status:", error);
        return { success: false, error: "Could not toggle slot status" };
    }
}

/**
 * Updates the status of a booking (e.g., Accept or Decline).
 */
export async function updateBookingStatus(bookingId: string, status: string) {
    try {
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status },
            include: {
                coach: {
                    include: {
                        user: true
                    }
                },
                student: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // Notify the student about the status update
        if (booking.student.userId) {
            await createNotification(
                booking.student.userId,
                status === "confirmed" ? "BOOKING_ACCEPTED" : "BOOKING_REJECTED",
                `Your booking request with coach ${booking.coach.user.name} has been ${status === 'confirmed' ? 'accepted' : 'declined'}.`,
                "/student/bookings"
            );
        }

        revalidatePath('/coach/bookings');
        revalidatePath('/student/bookings');
        revalidatePath('/coach');

        return { success: true, data: booking };
    } catch (error) {
        console.error("Error updating booking status:", error);
        return { success: false, error: "Could not update booking status" };
    }
}

/**
 * This function gets all the students who have booked with a coach and calculates summary data.
 */
export async function getCoachStudents(id: string) {
    try {
        // Try to find the coach profile if id is a userId
        let coachId = id;
        const coach = await prisma.coach.findUnique({
            where: { userId: id }
        });

        if (coach) {
            coachId = coach.id;
        }

        const bookings = await prisma.booking.findMany({
            where: {
                coachId,
                status: 'confirmed'
            },
            include: {
                student: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Group by student and calculate totals
        const studentMap = new Map();

        bookings.forEach(booking => {
            const studentId = booking.studentId;
            if (!studentMap.has(studentId)) {
                studentMap.set(studentId, {
                    id: studentId,
                    name: booking.student.user.name,
                    email: booking.student.user.email,
                    totalHours: 0,
                    lessonsCount: 0,
                    lastLesson: booking.date,
                    history: []
                });
            }

            const stats = studentMap.get(studentId);
            stats.totalHours += (booking.duration / 60);
            stats.lessonsCount += 1;
            stats.history.push({
                id: booking.id,
                date: booking.date,
                time: booking.time,
                duration: booking.duration,
                amount: booking.amount
            });
        });

        return { success: true, data: Array.from(studentMap.values()) };
    } catch (error) {
        console.error("Error fetching coach students:", error);
        return { success: false, error: "Could not fetch student history" };
    }
}

export async function getStudentBookings(userId: string) {
    try {
        const student = await (prisma as any).student.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!student) {
            return { success: false, error: "Student not found" };
        }

        const bookings = await (prisma as any).booking.findMany({
            where: { studentId: student.id },
            include: {
                coach: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Format for UI
        const formattedBookings = bookings.map((b: any) => ({
            id: b.id,
            coach: b.coach.user.name || 'Anonymous',
            coachRating: b.coach.rating,
            date: b.date,
            time: b.time,
            duration: b.duration,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(), // Capitalize
            topic: b.topic || 'Chess Lesson',
            link: b.meetingLink || '',
            amount: b.amount
        }));

        return { success: true, data: formattedBookings };
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        return { success: false, error: "Failed to fetch bookings" };
    }
}

/**
 * Gets all availability slots and confirmed bookings for a coach to build a calendar.
 */
export async function getCoachBookingAvailability(coachId: string) {
    try {
        const coach = await prisma.coach.findUnique({
            where: { id: coachId },
            include: {
                user: true,
                slots: true,
                bookings: {
                    where: {
                        status: 'confirmed'
                    },
                    include: {
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!coach) {
            return { success: false, error: "Coach not found" };
        }

        return {
            success: true,
            data: {
                coach: {
                    id: coach.id,
                    name: coach.user.name,
                    title: coach.title,
                    hourlyRate: coach.hourlyRate,
                    avatar: coach.avatar,
                    specialties: coach.specialties,
                    stars: coach.stars,
                    rating: coach.rating
                },
                slots: coach.slots,
                bookings: coach.bookings
            }
        };
    } catch (error) {
        console.error("Error fetching coach availability:", error);
        return { success: false, error: "Could not fetch availability details" };
    }
}

/**
 * Gets all bookings for a coach.
 */
export async function getCoachBookings(coachId: string) {
    try {
        const bookings = await prisma.booking.findMany({
            where: { coachId },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        return { success: true, data: bookings };
    } catch (error) {
        console.error("Error fetching coach bookings:", error);
        return { success: false, error: "Could not fetch bookings" };
    }
}
