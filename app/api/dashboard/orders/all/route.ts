import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatUserId } from "@/lib/utils/formatters";

export async function GET() {
    try {
        // Step 1: Get IDs sorted by custom status priority and created_at
        const sortedIdsResults = await prisma.$queryRaw<{ id: number }[]>`
            SELECT id 
            FROM "Order" 
            ORDER BY 
              CASE LOWER(status)
                WHEN 'pending' THEN 1
                WHEN 'processing' THEN 2
                WHEN 'shipped' THEN 3
                WHEN 'delivered' THEN 4
                WHEN 'completed' THEN 5
                ELSE 6
              END ASC,
              created_at DESC
            LIMIT 100
        `;

        const sortedIds = sortedIdsResults.map(r => r.id);

        if (sortedIds.length === 0) {
            return NextResponse.json([]);
        }

        // Step 2: Fetch full data for these IDs
        const ordersUnsorted = await prisma.order.findMany({
            where: {
                id: { in: sortedIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true
            }
        });

        // Step 3: Re-sort in JS to match the ID order from Step 1
        const idMap = new Map(ordersUnsorted.map(o => [o.id, o]));
        const orders = sortedIds.map(id => idMap.get(id)).filter(o => o !== undefined);

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
