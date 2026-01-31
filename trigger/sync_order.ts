import prisma from "@/lib/prisma";
import { OrderResponse } from "@/lib/types";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { fetchOrdersFromExternalApi } from "@/lib/services/external/orderApiService";
import * as orderRepo from "@/lib/repositories/orderRepository";
import * as userRepo from "@/lib/repositories/userRepository";
import * as orderItemRepo from "@/lib/repositories/orderItemRepository";
import * as productRepo from "@/lib/repositories/productRepository";
import { Prisma } from "@/app/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

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

function extractAllOrderItems(orders: OrderResponse[]) {
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

export async function processOrderItems(tx: TransactionClient, orders: OrderResponse[]) {
  if (orders.length === 0) return;

  // Extract all order items from orders
  const allOrderItems = extractAllOrderItems(orders);

  // Ensure all products exist (create missing ones)
  const allProductIds = allOrderItems.map((item) => item.product_id);
  const productPriceMap = await productRepo.ensureProductsExist(tx, allProductIds);

  // Group order items by existence (create only)
  const itemsToCreate = await orderItemRepo.groupOrderItemsByExistence(tx, allOrderItems);

  // Execute Create Operations
  await orderItemRepo.createOrderItems(tx, itemsToCreate, productPriceMap);

  logger.info(`Order items sync completed`, {
    created: itemsToCreate.length,
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

    // Fetch from external API
    const orderData = await fetchOrdersFromExternalApi();

    // Extract unique users
    const allUsers = extractUniqueUsers(orderData);

    // Group orders
    const orderIds = orderData.map((o) => o.order_id);
    const { existing: existingOrderIds } = await orderRepo.groupOrdersByExistence(orderIds);

    const ordersToCreate = orderData.filter((o) => !existingOrderIds.has(o.order_id));
    const ordersToUpdate = orderData.filter((o) => existingOrderIds.has(o.order_id));

    // Execute order operations first, then items
    await prisma.$transaction(async (tx) => {
      // Ensure users exist (create if missing)
      await userRepo.createUsers(tx, Array.from(allUsers.values()));

      // Save/Update orders
      await orderRepo.createOrders(tx, ordersToCreate);
      await orderRepo.updateOrders(tx, ordersToUpdate);
    });

    logger.info("Order sync completed successfully", {
      totalOrders: orderData.length,
      created: ordersToCreate.length,
      updated: ordersToUpdate.length,
      users: allUsers.size,
    });

    // After orders are successfully processed, save order items
    await prisma.$transaction(async (tx) => {
      await processOrderItems(tx, orderData);
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
