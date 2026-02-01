import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatSKU } from "@/lib/utils/formatters";

export async function GET() {
    try {
        // Fetch all products
        const products = await prisma.product.findMany({
            orderBy: { created_at: "desc" },
            include: {
                reviews: {
                    select: { rating: true }
                },
                // To calculate sales, we need order items ideally.
                // But fetching all order items for all products might be heavy.
                // Let's do a separate aggregation.
            }
        });

        // Fetch sales counts (aggregated)
        const salesAgg = await prisma.orderItem.groupBy({
            by: ['product_id'],
            _sum: {
                quantity: true
            }
        });

        const salesMap = new Map<number, number>();
        salesAgg.forEach(item => {
            if (item.product_id) salesMap.set(item.product_id, item._sum.quantity || 0);
        });

        // Transform
        const detailedProducts = products.map(product => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;

            return {
                name: product.name,
                category: product.category,
                price: product.price,
                stock: 100, // Still mock or calculated if schema changes
                sku: formatSKU(product.brand, product.category, product.id),
                rating: Number(avgRating.toFixed(1)),
                sales: salesMap.get(product.id) || 0
            };
        });

        return NextResponse.json(detailedProducts);
    } catch (error) {
        console.error("Error fetching all products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
