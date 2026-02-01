import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            take: 5,
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        const recentOrders = orders.map(order => ({
            id: order.id.toString(),
            customer: order.user.name,
            amount: order.total_price,
            status: order.status,
        }));

        return NextResponse.json(recentOrders);
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
