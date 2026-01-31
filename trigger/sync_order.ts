import { chunk } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { OrderResponse } from "@/lib/types";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { Prisma } from "@/app/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

async function fetchOrderData(): Promise<OrderResponse[]> {
  const response = await fetch(process.env.ORDER_API_URL as string);
  return (await response.json()) as OrderResponse[];
}

function extractUniqueUsers(orders: OrderResponse[]) {
  const allUsers = new Map<number, { id: number; name: string; email: string; created_at: Date }>();
  orders.forEach((order) => {
    if (!allUsers.has(order.user_id)) {
      allUsers.set(order.user_id, {
        id: order.user_id,
        name: `User ${order.user_id}`,
        email: `user${order.user_id}@example.com`,
        created_at: new Date(),
      });
    }
  });
  return allUsers;
}

async function ensureUsersExist(
  tx: TransactionClient,
  users: Map<number, { id: number; name: string; email: string; created_at: Date }>
) {
  if (users.size > 0) {
    await tx.user.createMany({
      data: Array.from(users.values()),
      skipDuplicates: true,
    });
    logger.info(`Processed ${users.size} users (skipDuplicates)`);
  }
}

async function groupOrdersByExistence(orders: OrderResponse[]) {
  const orderIds = orders.map((o) => o.order_id);
  const existingOrders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true },
  });
  const existingOrderIds = new Set(existingOrders.map((o) => o.id));

  const ordersToCreate = orders.filter((o) => !existingOrderIds.has(o.order_id));
  const ordersToUpdate = orders.filter((o) => existingOrderIds.has(o.order_id));

  return { ordersToCreate, ordersToUpdate };
}

async function extractAllOrderItems(orders: OrderResponse[]) {
  const allOrderItems: Array<{ order_id: number; product_id: number; quantity: number }> = [];
  orders.forEach((order) => {
    order.items.forEach((item) => {
      allOrderItems.push({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    });
  });
  return allOrderItems;
}

async function groupOrderItemsByExistence(
  tx: TransactionClient,
  orderItems: Array<{ order_id: number; product_id: number; quantity: number }>
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

  const itemsToCreate: Array<{ order_id: number; product_id: number; quantity: number }> = [];
  const itemsToUpdate: Array<{ id: number; order_id: number; product_id: number; quantity: number }> = [];

  for (const item of orderItems) {
    const key = `${item.order_id}-${item.product_id}`;
    const existingId = existingItemsMap.get(key);

    if (existingId !== undefined) {
      itemsToUpdate.push({ id: existingId, ...item });
    } else {
      itemsToCreate.push(item);
    }
  }

  return { itemsToCreate, itemsToUpdate };
}

async function ensureProductsExist(
  tx: TransactionClient,
  productIds: number[]
): Promise<Map<number, number>> {
  // Get unique product IDs
  const uniqueProductIds = [...new Set(productIds)];

  // Check which products already exist
  const existingProducts = await tx.product.findMany({
    where: { id: { in: uniqueProductIds } },
    select: { id: true, price: true },
  });

  const existingProductMap = new Map(existingProducts.map((p) => [p.id, p.price]));

  // Find products that don't exist
  const missingProductIds = uniqueProductIds.filter((id) => !existingProductMap.has(id));

  // Create placeholder products for missing ones
  if (missingProductIds.length > 0) {
    const createChunks = chunk(missingProductIds, Number(process.env.BATCH_SIZE));

    for (const [index, batch] of createChunks.entries()) {
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
      logger.info(`Created missing products batch ${index + 1}/${createChunks.length} (${batch.length} products)`);
    }

    // Add newly created products to map with default price 0
    for (const id of missingProductIds) {
      existingProductMap.set(id, 0);
    }
  }

  return existingProductMap;
}


export async function saveNewOrders(tx: TransactionClient, ordersToCreate: OrderResponse[]) {
  const createChunks = chunk(ordersToCreate, Number(process.env.BATCH_SIZE));
  for (const [index, batch] of createChunks.entries()) {
    await tx.order.createMany({
      data: batch.map((o) => ({
        id: o.order_id,
        user_id: o.user_id,
        total_price: o.total_price,
        status: o.status,
        created_at: new Date(),
      })),
    });
    logger.info(`Created batch ${index + 1}/${createChunks.length} (${batch.length} orders)`);
  }
}

export async function updateExistingOrders(tx: TransactionClient, ordersToUpdate: OrderResponse[]) {
  const updateChunks = chunk(ordersToUpdate, Number(process.env.BATCH_SIZE));
  for (const [index, batch] of updateChunks.entries()) {
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
    logger.info(`Updated batch ${index + 1}/${updateChunks.length} (${batch.length} orders)`);
  }
}

export async function saveOrderItems(tx: TransactionClient, orders: OrderResponse[]) {
  if (orders.length === 0) return;

  // 1. Extract all order items from orders
  const allOrderItems = await extractAllOrderItems(orders);

  // 2. Ensure all products exist (create missing ones)
  const allProductIds = allOrderItems.map((item) => item.product_id);
  const productPriceMap = await ensureProductsExist(tx, allProductIds);

  // 3. Group order items by existence (create vs update)
  const { itemsToCreate, itemsToUpdate } = await groupOrderItemsByExistence(tx, allOrderItems);

  // 4. Execute Create Operations
  if (itemsToCreate.length > 0) {
    const BATCH_SIZE = 50;
    const createChunks = chunk(itemsToCreate, BATCH_SIZE);
    for (const [index, batch] of createChunks.entries()) {
      await tx.orderItem.createMany({
        data: batch.map((item) => ({
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: productPriceMap.get(item.product_id) ?? 0,
        })),
      });
      logger.info(`Created items batch ${index + 1}/${createChunks.length} (${batch.length} items)`);
    }
  }

  // 5. Execute Update Operations
  if (itemsToUpdate.length > 0) {
    const BATCH_SIZE = 50;
    const updateChunks = chunk(itemsToUpdate, BATCH_SIZE);
    for (const [index, batch] of updateChunks.entries()) {
      await Promise.all(
        batch.map((item) =>
          tx.orderItem.update({
            where: { id: item.id },
            data: {
              quantity: item.quantity,
              price: productPriceMap.get(item.product_id) ?? 0,
              updated_at: new Date(),
            },
          })
        )
      );
      logger.info(`Updated items batch ${index + 1}/${updateChunks.length} (${batch.length} items)`);
    }
  }

  logger.info(`Order items sync completed`, {
    created: itemsToCreate.length,
    updated: itemsToUpdate.length,
  });
}

export const syncOrder = schedules.task({
  id: "sync-order",
  cron: "0 * * * *",
  maxDuration: 300,
  run: async (payload) => {
    const startTime = Date.now();

    logger.info("Starting scheduled order sync", {
      timestamp: new Date().toISOString(),
      payload,
    });

    const orderData = await fetchOrderData();

    // Extract all unique users from orders
    const allUsers = extractUniqueUsers(orderData);

    // Group orders
    const { ordersToCreate, ordersToUpdate } = await groupOrdersByExistence(orderData);

    // Execute order operations first, then items
    await prisma.$transaction(async (tx) => {
      // Step 1: Ensure users exist (create if missing)
      await ensureUsersExist(tx, allUsers);

      // Step 2: Save/Update orders
      await saveNewOrders(tx, ordersToCreate);
      await updateExistingOrders(tx, ordersToUpdate);
    });

    logger.info("Order sync completed successfully", {
      totalOrders: orderData.length,
      created: ordersToCreate.length,
      updated: ordersToUpdate.length,
      users: allUsers.size,
    });

    // Step 3: After orders are successfully processed, save order items
    await prisma.$transaction(async (tx) => {
      await saveOrderItems(tx, orderData);
    });

    logger.info("Bulk order sync completed", {
      totalOrders: orderData.length,
      created: ordersToCreate.length,
      updated: ordersToUpdate.length,
      users: allUsers.size,
      totalItems: orderData.reduce((sum, o) => sum + o.items.length, 0),
    });

    const duration = Date.now() - startTime;
    logger.info("Finished scheduled order sync", {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  },
});
