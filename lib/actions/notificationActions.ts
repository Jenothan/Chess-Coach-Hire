"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
    try {
        const notifications = await (prisma as any).notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return { success: true, data: notifications };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await (prisma as any).notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        revalidatePath("/"); // Revalidate all as header is everywhere
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false, error: "Failed to mark as read" };
    }
}

export async function createNotification(userId: string, type: string, message: string, link?: string) {
    try {
        const notification = await (prisma as any).notification.create({
            data: {
                userId,
                type,
                message,
                link
            }
        });
        return { success: true, data: notification };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: "Failed to create notification" };
    }
}
