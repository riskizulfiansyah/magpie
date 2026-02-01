import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatUserId } from "@/lib/utils/formatters";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { created_at: "desc" },
            take: 100, // Limit for now
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true // to count items
            }
        });

        const detailedOrders = orders.map(order => ({
            id: order.id.toString(),
            userId: order.user.id,
            customer: order.user.name,
            formattedUserId: formatUserId(order.user.id),
            email: order.user.email,
            amount: order.total_price,
            status: order.status,
            date: order.created_at.toISOString().split('T')[0],
            items: order.items.length
        }));

        return NextResponse.json(detailedOrders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
