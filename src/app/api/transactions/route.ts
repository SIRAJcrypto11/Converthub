import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { planName, amount, currency, paymentMethod } = await req.json();

        const transaction = await prisma.transaction.create({
            data: {
                userId: session.user.id,
                planName,
                amount: parseFloat(amount),
                currency,
                paymentMethod,
                status: "PENDING",
            },
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("TRANSACTION_CREATE_ERROR", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;

    try {
        if (role === "ADMIN" || role === "OWNER") {
            const transactions = await prisma.transaction.findMany({
                include: { user: { select: { email: true, name: true } } },
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json(transactions);
        } else {
            const transactions = await prisma.transaction.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json(transactions);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}
