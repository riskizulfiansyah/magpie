import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // We need to join OrderItem -> Product to get category
        // Then sum (price * quantity) group by category

        const revenueByCategory = await prisma.orderItem.groupBy({
            by: ['product_id'],
            _sum: {
                price: true, // Note: This assumes price is total for line item? No, schema says price is unit price usually?
                // Wait, schema check: OrderItem { quantity: Int, price: Float }
                // Usually price in OrderItem is unit price at time of purchase.
                // But prisma groupBy doesn't support complex calculations like sum(price * quantity).
                // We might need to fetch and aggregate, or use raw query.
            },
        });

        // To do this correctly with Prisma without raw SQL is tricky for "revenue = price * quantity".
        // Let's use raw query for correctness.

        // However, for safety and simplicity in this scaffolding phase, let's fetch products and aggregate.
        // Ideally: SELECT p.category, SUM(oi.price * oi.quantity) ...

        const uniqueProductIds = [...new Set(revenueByCategory.map(item => item.product_id).filter((id): id is number => id !== null))];

        const products = await prisma.product.findMany({
            where: { id: { in: uniqueProductIds } },
            select: { id: true, category: true }
        });

        const productCategoryMap = new Map(products.map(p => [p.id, p.category]));

        // Now we need the actual order items to sum correctly (price * quantity)
        // The previous groupBy was insufficient.
        const orderItems = await prisma.orderItem.findMany({
            select: {
                product_id: true,
                price: true,
                quantity: true
            }
        });

        const categoryRevenue: Record<string, number> = {};

        for (const item of orderItems) {
            if (!item.product_id) continue;
            const category = productCategoryMap.get(item.product_id) || "Unknown";
            if (!categoryRevenue[category]) categoryRevenue[category] = 0;
            categoryRevenue[category] += (item.price * item.quantity);
        }

        const colors = ["#fca311", "#e5e5e5", "#6b7280", "#3b82f6", "#10b981"];

        const data = Object.entries(categoryRevenue).map(([name, revenue], index) => ({
            name,
            revenue,
            color: colors[index % colors.length],
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching category revenue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
