import prisma from "@/lib/prisma";
import { Prisma, User } from "@/app/generated/prisma/client";
import { TransactionClient, batchProcess } from "./baseRepository";
import { logger } from "@trigger.dev/sdk/v3";

export type CreateUserInput = Prisma.UserCreateManyInput;

/**
 * Get users with pagination
 */
export async function getUsers(page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
        }),
        prisma.user.count(),
    ]);
    return { users, total };
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                take: 5,
                orderBy: { created_at: "desc" },
            },
        },
    });
}

/**
 * Bulk create users if they don't exist
 */
export async function createUsers(
    tx: TransactionClient,
    users: CreateUserInput[]
): Promise<void> {
    if (users.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(users, batchSize, async (batch, index, total) => {
        await tx.user.createMany({
            data: batch.map((user) => ({
                ...user,
                created_at: new Date(),
            })),
            skipDuplicates: true,
        });
        logger.info(`Processed users batch ${index + 1}/${total} (${batch.length} users)`);
    });
}
