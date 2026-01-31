
import { TransactionClient, batchProcess } from "./baseRepository";
import { logger } from "@trigger.dev/sdk/v3";

interface ItemInput {
    order_id: number;
    product_id: number;
    quantity: number;
}



/**
 * Group order items by existence (create vs update)
 */
export async function groupOrderItemsByExistence(
    tx: TransactionClient,
    orderItems: ItemInput[]
) {
    // Get all unique order_id + product_id combinations
    const orderIds = [...new Set(orderItems.map((item) => item.order_id))];

    // Fetch existing order items for these orders
    const existingItems = await tx.orderItem.findMany({
        where: { order_id: { in: orderIds } },
        select: { id: true, order_id: true, product_id: true },
    });

    // Create a map: "order_id-product_id" -> existing item id
    const existingItemsMap = new Map<string, number>();
    for (const item of existingItems) {
        if (item.product_id !== null) {
            const key = `${item.order_id}-${item.product_id}`;
            existingItemsMap.set(key, item.id);
        }
    }

    const itemsToCreate: ItemInput[] = [];

    for (const item of orderItems) {
        const key = `${item.order_id}-${item.product_id}`;
        // If it doesn't exist, we create it
        if (!existingItemsMap.has(key)) {
            itemsToCreate.push(item);
        }
    }

    return itemsToCreate;
}

/**
 * Bulk create order items
 */
export async function createOrderItems(
    tx: TransactionClient,
    items: ItemInput[],
    productPriceMap: Map<number, number>
): Promise<void> {
    if (items.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(items, batchSize, async (batch, index, total) => {
        await tx.orderItem.createMany({
            data: batch.map((item) => ({
                order_id: item.order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: productPriceMap.get(item.product_id) ?? 0,
                created_at: new Date(),
            })),
        });
        logger.info(`Created items batch ${index + 1}/${total} (${batch.length} items)`);
    });
}


