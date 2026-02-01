import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const categoryGroups = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                category: true,
            },
        });

        // You might want a consistent color mapping here
        const colors = ["#fca311", "#e5e5e5", "#6b7280", "#3b82f6", "#10b981"];

        const data = categoryGroups.map((group, index) => ({
            name: group.category.substring(0, 4), // Abbreviate for chart if needed, or keep full
            value: group._count.category,
            color: colors[index % colors.length],
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching product category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
