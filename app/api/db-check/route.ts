import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This is a simple API route to check if your database is connected.
// You can visit this at: http://localhost:3000/api/db-check

export async function GET() {
    try {
        // We try to run a simple command: counting how many users are in the database.
        // If this works, it means the connection is alive!
        const userCount = await prisma.user.count();

        return NextResponse.json({
            status: "Connected!",
            message: "Database is working perfectly.",
            totalUsers: userCount,
        });
    } catch (error) {
        // If there is an error, we return the error message.
        return NextResponse.json(
            {
                status: "Error",
                message: "Could not connect to the database.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
