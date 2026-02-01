import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const statusGroups = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        const colors: Record<string, string> = {
            Shipped: "#fca311",
            Processing: "#3b82f6",
            Delivered: "#e5e5e5",
            Returned: "#6b7280",
            Cancelled: "#ef4444",
        };

        const data = statusGroups.map((group) => ({
            name: group.status,
            value: group._count.status,
            color: colors[group.status] || "#cccccc",
        }));

        // If no data, return empty structure or defaults if preferred
        // For now, returning what we found
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching order status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
