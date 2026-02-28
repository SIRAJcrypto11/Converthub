import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET: List all users (ADMIN/OWNER only)
 */
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                image: true,
            },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("USERS_LIST_ERROR", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

/**
 * PATCH: Update a user's role (OWNER only)
 * Body: { userId: string, role: "USER" | "ADMIN" | "OWNER" }
 */
export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "OWNER") {
        return NextResponse.json({ error: "Only OWNER can change roles" }, { status: 403 });
    }

    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
        }

        if (!["USER", "ADMIN", "OWNER"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Prevent OWNER from demoting themselves
        if (userId === session.user.id && role !== "OWNER") {
            return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("USER_ROLE_UPDATE_ERROR", error);
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}

/**
 * DELETE: Remove a user (OWNER only)
 * Body: { userId: string }
 */
export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "OWNER") {
        return NextResponse.json({ error: "Only OWNER can delete users" }, { status: 403 });
    }

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Prevent OWNER from deleting themselves
        if (userId === session.user.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
        }

        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("USER_DELETE_ERROR", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
