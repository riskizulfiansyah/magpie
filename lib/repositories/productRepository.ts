import prisma from "@/lib/prisma";
import { Prisma, Product } from "@/app/generated/prisma/client";
import { TransactionClient, batchProcess } from "./baseRepository";
import { logger } from "@trigger.dev/sdk/v3";
import { ProductResponse } from "@/lib/types";

export type CreateProductInput = Prisma.ProductCreateManyInput;
export type UpdateProductInput = Prisma.ProductUpdateInput & { id: number };

/**
 * Get products with filtering and pagination
 */
export async function getProducts(
    page: number = 1,
    limit: number = 20,
    filters: {
        category?: string;
        brand?: string;
        minPrice?: number;
        maxPrice?: number;
        availability?: boolean;
        ids?: number[];
    } = {}
): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (filters.category) where.category = filters.category;
    if (filters.brand) where.brand = filters.brand;
    if (filters.availability !== undefined) where.availability = filters.availability;
    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.ids) where.id = { in: filters.ids };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
        }),
        prisma.product.count({ where }),
    ]);

    return { products, total };
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
        where: { id },
        include: {
            reviews: {
                take: 5,
                orderBy: { created_at: "desc" },
            },
        },
    });
}

/**
 * Group product IDs by whether they exist in the DB
 */
export async function groupProductsByExistence(productIds: number[]): Promise<{ existing: Set<number>, missing: number[] }> {
    const uniqueIds = [...new Set(productIds)];
    const existingProducts = await prisma.product.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true },
    });

    const existingSet = new Set(existingProducts.map(p => p.id));
    const missing = uniqueIds.filter(id => !existingSet.has(id));

    return { existing: existingSet, missing };
}

/**
 * Bulk create products
 */
export async function createProducts(
    tx: TransactionClient,
    products: ProductResponse[]
): Promise<void> {
    if (products.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(products, batchSize, async (batch, index, total) => {
        await tx.product.createMany({
            data: batch.map((p) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { product_id, reviews, ...productFields } = p;
                return {
                    id: product_id,
                    ...productFields,
                    created_at: new Date(),
                };
            }),
        });
        logger.info(`Created batch ${index + 1}/${total} (${batch.length} products)`);
    });
}

/**
 * Bulk update products
 */
export async function updateProducts(
    tx: TransactionClient,
    products: ProductResponse[]
): Promise<void> {
    if (products.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(products, batchSize, async (batch, index, total) => {
        await Promise.all(
            batch.map((p) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { product_id, reviews, ...productFields } = p;
                return tx.product.update({
                    where: { id: product_id },
                    data: {
                        ...productFields,
                        updated_at: new Date(),
                    },
                });
            })
        );
        logger.info(`Updated batch ${index + 1}/${total} (${batch.length} products)`);
    });
}

/**
 * Ensure products exist, creating placeholders if missing.
 * Returns map of ID -> Price for all requested products.
 */
export async function ensureProductsExist(
    tx: TransactionClient,
    productIds: number[]
): Promise<Map<number, number>> {
    const { missing } = await groupProductsByExistence(productIds);

    // Create placeholders for missing
    if (missing.length > 0) {
        const batchSize = Number(process.env.BATCH_SIZE) || 50;

        await batchProcess(missing, batchSize, async (batch, index, total) => {
            await tx.product.createMany({
                data: batch.map((id) => ({
                    id,
                    name: `Product ${id}`,
                    description: `Auto-created product for order sync`,
                    price: 0,
                    image: "",
                    brand: "Unknown",
                    category: "Unknown",
                    created_at: new Date(),
                })),
                skipDuplicates: true,
            });
            logger.info(`Created missing products batch ${index + 1}/${total} (${batch.length} products)`);
        });
    }

    // Fetch prices for all products (now that missing are created)
    const allProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
    });

    return new Map(allProducts.map(p => [p.id, p.price]));
}
