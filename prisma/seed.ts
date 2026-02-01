import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Seeding database...');

    // Fix sequences
    try {
        await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Order"', 'id'), COALESCE((SELECT MAX(id)+1 FROM "Order"), 1), false);`;
        await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"OrderItem"', 'id'), COALESCE((SELECT MAX(id)+1 FROM "OrderItem"), 1), false);`;
        console.log('Sequences synced.');
    } catch (e) {
        console.warn('Failed to sync sequences (might be fine if tables are empty):', e);
    }

    // Helper to create order with random User and Product IDs
    const createOrder = async (date: Date, price: number) => {
        // Random User ID 1-16
        const userId = Math.floor(Math.random() * 16) + 1;
        // Random Product ID 1-10
        const productId = Math.floor(Math.random() * 10) + 1;

        await prisma.order.create({
            data: {
                user_id: userId,
                total_price: price,
                status: 'completed',
                created_at: date,
                items: {
                    create: {
                        product_id: productId,
                        quantity: 1,
                        price: price,
                    },
                },
            },
        });
    };

    // Seed: Entire 2025
    const yearToSeed = 2025;
    const baseAmount = 5000;

    for (let month = 0; month < 12; month++) {
        // Create 2-3 orders per month to add some variety
        const numOrders = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < numOrders; i++) {
            // Random day between 1 and 28
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(yearToSeed, month, day);

            // Randomize price a bit: base + random variance + monthly trend (e.g. higher in Q4)
            let monthFactor = 1;
            if (month >= 9) monthFactor = 1.5; // Q4 bump
            if (month === 11) monthFactor = 2.0; // December peak

            const price = Math.round((baseAmount + Math.random() * 2000) * monthFactor);

            await createOrder(date, price);
        }
    }

    console.log('Seeded data for entire 2025.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
