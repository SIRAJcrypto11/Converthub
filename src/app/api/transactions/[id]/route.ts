import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 303 });
    }

    try {
        const { status } = await req.json();

        const transaction = await prisma.transaction.update({
            where: { id: params.id },
            data: { status },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
