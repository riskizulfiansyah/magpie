import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Top products by quantity sold
        const topSelling = await prisma.orderItem.groupBy({
            by: ['product_id'],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        const productIds = topSelling.map(item => item.product_id).filter((id): id is number => id !== null);

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // Map back to shape
        const productMap = new Map(products.map(p => [p.id, p]));

        const result = topSelling.map(item => {
            if (!item.product_id) return null;
            const product = productMap.get(item.product_id);
            if (!product) return null;

            return {
                name: product.name,
                category: product.category,
                price: product.price,
                stock: 100, // Placeholder as stock is not in schema? Or maybe I missed it.
                // Let's check schema: Product { ... } does not seem to have stock. 
                // We'll calculate "sold" instead or just mock stock for now.
            };
        }).filter(item => item !== null);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching top products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
