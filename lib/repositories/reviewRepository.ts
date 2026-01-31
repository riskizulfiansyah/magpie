import prisma from "@/lib/prisma";
import { TransactionClient, batchProcess } from "./baseRepository";
import { logger } from "@trigger.dev/sdk/v3";
import { ProductReview } from "@/app/generated/prisma/client";

export interface ReviewInput {
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
}



/**
 * Get reviews for a product
 */
export async function getReviewsByProductId(productId: number): Promise<ProductReview[]> {
    return prisma.productReview.findMany({
        where: { product_id: productId },
        orderBy: { created_at: "desc" },
    });
}

/**
 * Group reviews by existence (create vs update)
 */
export async function groupReviewsByExistence(
    tx: TransactionClient,
    reviews: ReviewInput[]
) {
    // Get all unique product_ids to optimize fetching
    const productIds = [...new Set(reviews.map((r) => r.product_id))];

    // Fetch existing reviews for these products (could be optimized further if needed)
    const existingReviews = await tx.productReview.findMany({
        where: { product_id: { in: productIds } },
        select: { id: true, user_id: true, product_id: true },
    });

    // Create a map: "user_id-product_id" -> existing review id
    const existingReviewsMap = new Map<string, number>();
    for (const review of existingReviews) {
        const key = `${review.user_id}-${review.product_id}`;
        existingReviewsMap.set(key, review.id);
    }

    const reviewsToCreate: ReviewInput[] = [];

    for (const review of reviews) {
        const key = `${review.user_id}-${review.product_id}`;
        // If it doesn't exist, we create it
        if (!existingReviewsMap.has(key)) {
            reviewsToCreate.push(review);
        }
    }

    return reviewsToCreate;
}

/**
 * Bulk create reviews
 */
export async function createReviews(
    tx: TransactionClient,
    reviews: ReviewInput[]
): Promise<void> {
    if (reviews.length === 0) return;

    const batchSize = Number(process.env.BATCH_SIZE) || 50;

    await batchProcess(reviews, batchSize, async (batch, index, total) => {
        await tx.productReview.createMany({
            data: batch.map((review) => ({
                user_id: review.user_id,
                product_id: review.product_id,
                rating: review.rating,
                comment: review.comment,
                created_at: new Date(),
            })),
            skipDuplicates: true,
        });
        logger.info(`Created reviews batch ${index + 1}/${total} (${batch.length} reviews)`);
    });
}


