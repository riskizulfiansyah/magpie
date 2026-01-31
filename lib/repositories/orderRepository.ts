import prisma from "@/lib/prisma";
import { Prisma, Order } from "@/app/generated/prisma/client";
import { TransactionClient, batchProcess } from "./baseRepository";
import { logger } from "@trigger.dev/sdk/v3";
import { OrderResponse } from "@/lib/types";

/**
 * Get orders with filtering and pagination
 */
export async function getOrders(
    page: number = 1,
    limit: number = 20,
    filters: {
        userId?: number;
        status?: string;
    } = {}
): Promise<{ orders: Order[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {};

    if (filters.userId) where.user_id = filters.userId;
    if (filters.status) where.status = filters.status;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
            include: {
                items: true,
            },
        }),
        prisma.order.count({ where }),
    ]);

    return { orders, total };
}

/**
 * Get order by ID
 */
export async function getOrderById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({
        where: { id },
        include: {
            items: true, // simplified include
            user: true,
        },
    });
}

/**
 * Group order IDs by whether they exist in the DB
 */
export async function groupOrdersByExistence(orderIds: number[]): Promise<{ existing: Set<number>, missing: number[] }> {
    const uniqueIds = [...new Set(orderIds)];
    const existingOrders = await prisma.order.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true },
    });

    const existingSet = new Set(existingOrders.map(o => o.id));
    const missing = uniqueIds.filter(id => !existingSet.has(id));

    return { existing: existingSet, missing };
}

/**
 * Bulk create orders
 */
export async function createOrders(
    tx: TransactionClient,
    orders: OrderResponse[]
): Promise<void> {
    if (orders.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(orders, batchSize, async (batch, index, total) => {
        await tx.order.createMany({
            data: batch.map((o) => ({
                id: o.order_id,
                user_id: o.user_id,
                total_price: o.total_price,
                status: o.status,
                created_at: new Date(),
            })),
        });
        logger.info(`Created batch ${index + 1}/${total} (${batch.length} orders)`);
    });
}

/**
 * Bulk update orders
 */
export async function updateOrders(
    tx: TransactionClient,
    orders: OrderResponse[]
): Promise<void> {
    if (orders.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(orders, batchSize, async (batch, index, total) => {
        await Promise.all(
            batch.map((o) =>
                tx.order.update({
                    where: { id: o.order_id },
                    data: {
                        user_id: o.user_id,
                        total_price: o.total_price,
                        status: o.status,
                        updated_at: new Date(),
                    },
                })
            )
        );
        logger.info(`Updated batch ${index + 1}/${total} (${batch.length} orders)`);
    });
}
