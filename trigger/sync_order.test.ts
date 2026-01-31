import { describe, expect, test, beforeEach, afterAll } from "bun:test";
import prisma from "@/lib/prisma";
import { OrderResponse } from "@/lib/types";
import { saveNewOrders, updateExistingOrders, saveOrderItems } from "./sync_order";

// Test data
const createTestUser = async (id: number) => {
    return prisma.user.upsert({
        where: { id },
        update: {},
        create: {
            id,
            name: `Test User ${id}`,
            email: `testuser${id}@example.com`,
        },
    });
};

const createTestProduct = async (id: number, price: number = 100) => {
    return prisma.product.upsert({
        where: { id },
        update: { price },
        create: {
            id,
            name: `Test Product ${id}`,
            description: `Description for product ${id}`,
            price,
            image: "https://example.com/image.png",
            brand: "Test Brand",
            category: "Test Category",
        },
    });
};

const cleanup = async () => {
    // Clean up in reverse order of dependencies
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productReview.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
};

describe("sync_order", () => {
    beforeEach(async () => {
        await cleanup();
    });

    afterAll(async () => {
        await cleanup();
        await prisma.$disconnect();
    });

    describe("saveNewOrders", () => {
        test("should create new orders", async () => {
            // Setup
            await createTestUser(1);

            const ordersToCreate: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [],
                    total_price: 250.5,
                    status: "pending",
                },
                {
                    order_id: 101,
                    user_id: 1,
                    items: [],
                    total_price: 150.0,
                    status: "completed",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveNewOrders(tx, ordersToCreate);
            });

            // Verify
            const orders = await prisma.order.findMany({
                orderBy: { id: "asc" },
            });

            expect(orders).toHaveLength(2);
            expect(orders[0].id).toBe(100);
            expect(orders[0].user_id).toBe(1);
            expect(orders[0].total_price).toBe(250.5);
            expect(orders[0].status).toBe("pending");
            expect(orders[1].id).toBe(101);
            expect(orders[1].status).toBe("completed");
        });
    });

    describe("updateExistingOrders", () => {
        test("should update existing orders", async () => {
            // Setup
            await createTestUser(1);
            await prisma.order.create({
                data: {
                    id: 100,
                    user_id: 1,
                    total_price: 100,
                    status: "pending",
                },
            });

            const ordersToUpdate: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [],
                    total_price: 500,
                    status: "completed",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await updateExistingOrders(tx, ordersToUpdate);
            });

            // Verify
            const order = await prisma.order.findUnique({ where: { id: 100 } });
            expect(order).not.toBeNull();
            expect(order!.total_price).toBe(500);
            expect(order!.status).toBe("completed");
        });
    });

    describe("saveOrderItems", () => {
        test("should create new order items with existing products", async () => {
            // Setup
            await createTestUser(1);
            await createTestProduct(10, 50);
            await createTestProduct(20, 100);
            await prisma.order.create({
                data: {
                    id: 100,
                    user_id: 1,
                    total_price: 300,
                    status: "pending",
                },
            });

            const orders: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [
                        { product_id: 10, quantity: 2 },
                        { product_id: 20, quantity: 1 },
                    ],
                    total_price: 300,
                    status: "pending",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, orders);
            });

            // Verify
            const orderItems = await prisma.orderItem.findMany({
                where: { order_id: 100 },
                orderBy: { product_id: "asc" },
            });

            expect(orderItems).toHaveLength(2);
            expect(orderItems[0].product_id).toBe(10);
            expect(orderItems[0].quantity).toBe(2);
            expect(orderItems[0].price).toBe(50);
            expect(orderItems[1].product_id).toBe(20);
            expect(orderItems[1].quantity).toBe(1);
            expect(orderItems[1].price).toBe(100);
        });

        test("should create missing products when product_id does not exist", async () => {
            // Setup
            await createTestUser(1);
            await prisma.order.create({
                data: {
                    id: 100,
                    user_id: 1,
                    total_price: 100,
                    status: "pending",
                },
            });

            // Product 999 does not exist
            const orders: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [{ product_id: 999, quantity: 3 }],
                    total_price: 100,
                    status: "pending",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, orders);
            });

            // Verify - Product should be created
            const product = await prisma.product.findUnique({ where: { id: 999 } });
            expect(product).not.toBeNull();
            expect(product!.name).toBe("Product 999");
            expect(product!.description).toBe("Auto-created product for order sync");
            expect(product!.price).toBe(0);

            // Verify - Order item should be created with the product
            const orderItems = await prisma.orderItem.findMany({
                where: { order_id: 100 },
            });
            expect(orderItems).toHaveLength(1);
            expect(orderItems[0].product_id).toBe(999);
            expect(orderItems[0].quantity).toBe(3);
            expect(orderItems[0].price).toBe(0);
        });

        test("should update existing order items", async () => {
            // Setup
            await createTestUser(1);
            await createTestProduct(10, 50);
            await prisma.order.create({
                data: {
                    id: 100,
                    user_id: 1,
                    total_price: 100,
                    status: "pending",
                },
            });
            await prisma.orderItem.create({
                data: {
                    order_id: 100,
                    product_id: 10,
                    quantity: 1,
                    price: 50,
                },
            });

            // Update quantity from 1 to 5
            const orders: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [{ product_id: 10, quantity: 5 }],
                    total_price: 250,
                    status: "pending",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, orders);
            });

            // Verify
            const orderItems = await prisma.orderItem.findMany({
                where: { order_id: 100 },
            });

            expect(orderItems).toHaveLength(1);
            expect(orderItems[0].product_id).toBe(10);
            expect(orderItems[0].quantity).toBe(5);
            expect(orderItems[0].price).toBe(50);
        });

        test("should handle mixed create and update operations", async () => {
            // Setup
            await createTestUser(1);
            await createTestProduct(10, 50);
            await createTestProduct(20, 100);
            await prisma.order.create({
                data: {
                    id: 100,
                    user_id: 1,
                    total_price: 50,
                    status: "pending",
                },
            });
            // Existing order item for product 10
            await prisma.orderItem.create({
                data: {
                    order_id: 100,
                    product_id: 10,
                    quantity: 1,
                    price: 50,
                },
            });

            // Update product 10, create product 20
            const orders: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [
                        { product_id: 10, quantity: 3 }, // Update
                        { product_id: 20, quantity: 2 }, // Create
                    ],
                    total_price: 350,
                    status: "pending",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, orders);
            });

            // Verify
            const orderItems = await prisma.orderItem.findMany({
                where: { order_id: 100 },
                orderBy: { product_id: "asc" },
            });

            expect(orderItems).toHaveLength(2);
            expect(orderItems[0].product_id).toBe(10);
            expect(orderItems[0].quantity).toBe(3);
            expect(orderItems[1].product_id).toBe(20);
            expect(orderItems[1].quantity).toBe(2);
        });

        test("should handle multiple orders at once", async () => {
            // Setup
            await createTestUser(1);
            await createTestUser(2);
            await createTestProduct(10, 50);
            await prisma.order.createMany({
                data: [
                    { id: 100, user_id: 1, total_price: 100, status: "pending" },
                    { id: 101, user_id: 2, total_price: 200, status: "pending" },
                ],
            });

            const orders: OrderResponse[] = [
                {
                    order_id: 100,
                    user_id: 1,
                    items: [{ product_id: 10, quantity: 2 }],
                    total_price: 100,
                    status: "pending",
                },
                {
                    order_id: 101,
                    user_id: 2,
                    items: [{ product_id: 10, quantity: 4 }],
                    total_price: 200,
                    status: "pending",
                },
            ];

            // Execute
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, orders);
            });

            // Verify
            const order100Items = await prisma.orderItem.findMany({
                where: { order_id: 100 },
            });
            const order101Items = await prisma.orderItem.findMany({
                where: { order_id: 101 },
            });

            expect(order100Items).toHaveLength(1);
            expect(order100Items[0].quantity).toBe(2);
            expect(order101Items).toHaveLength(1);
            expect(order101Items[0].quantity).toBe(4);
        });

        test("should handle empty orders array", async () => {
            await prisma.$transaction(async (tx) => {
                await saveOrderItems(tx, []);
            });
            // Should not throw and complete successfully
        });
    });
});
