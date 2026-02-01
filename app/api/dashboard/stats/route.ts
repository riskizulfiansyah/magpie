import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [totalRevenue, totalOrders, avgRating] = await Promise.all([
            prisma.order.aggregate({ _sum: { total_price: true } }),
            prisma.order.count(),
            prisma.productReview.aggregate({ _avg: { rating: true } }),
        ]);

        const revenue = totalRevenue._sum.total_price || 0;
        const count = totalOrders || 0;
        const rating = avgRating._avg.rating || 0;

        return NextResponse.json({
            totalRevenue: revenue,
            totalOrders: count,
            avgOrderValue: count > 0 ? revenue / count : 0,
            avgRating: rating,
            // For now, these are placeholders as we don't have historical data logic yet
            revenueChange: 0,
            ordersChange: 0,
            avgOrderChange: 0,
            ratingChange: 0,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
