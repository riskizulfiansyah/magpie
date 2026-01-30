import { chunk } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { ProductResponse, ReviewResponse } from "@/lib/types";
import { logger, schedules } from "@trigger.dev/sdk/v3";

export const syncProduct = schedules.task({
  id: "sync-product",
  cron: "0 * * * *",
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    const startTime = Date.now();

    logger.info('Starting scheduled sync', {
      timestamp: new Date().toISOString(),
    });

    const response = await fetch(process.env.PRODUCT_API_URL as string);
    const productData = (await response.json()) as ProductResponse[];


    // Extract all unique users from reviews
    const allUsers = new Map<number, { id: number; name: string; email: string }>();
    productData.forEach((product: ProductResponse) => {
      product.reviews?.forEach((review: ReviewResponse) => {
        if (!allUsers.has(review.user_id)) {
          allUsers.set(review.user_id, {
            id: review.user_id,
            name: `User ${review.user_id}`,
            email: `user${review.user_id}@example.com`,
          });
        }
      });
    });

    // Get existing products to determine create vs update
    const productIds = productData.map((p: ProductResponse) => p.product_id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const existingProductIds = new Set(existingProducts.map(p => p.id));

    // Separate products into create and update
    const productsToCreate = productData.filter((p: ProductResponse) => !existingProductIds.has(p.product_id));
    const productsToUpdate = productData.filter((p: ProductResponse) => existingProductIds.has(p.product_id));

    // Execute bulk operations in transaction
    await prisma.$transaction(async (tx) => {
      // Bulk upsert users -> optimize with createMany + skipDuplicates
      if (allUsers.size > 0) {
        await tx.user.createMany({
          data: Array.from(allUsers.values()),
          skipDuplicates: true,
        });
        logger.info(`Processed ${allUsers.size} users (skipDuplicates)`);
      }

      const BATCH_SIZE = 50;

      // Bulk create new products in chunks
      const createChunks = chunk(productsToCreate, BATCH_SIZE);
      for (const [index, batch] of createChunks.entries()) {
        await tx.product.createMany({
          data: batch.map((p: ProductResponse) => {
            const { product_id, reviews: _reviews, ...productFields } = p;
            return {
              id: product_id,
              ...productFields,
              created_at: new Date(),
            };
          }),
        });
        logger.info(`Created batch ${index + 1}/${createChunks.length} (${batch.length} products)`);
      }

      // Bulk update existing products in chunks
      const updateChunks = chunk(productsToUpdate, BATCH_SIZE);
      for (const [index, batch] of updateChunks.entries()) {
        await Promise.all(
          batch.map((p: ProductResponse) => {
            const { product_id, reviews: _reviews, ...productFields } = p;
            return tx.product.update({
              where: { id: product_id },
              data: {
                ...productFields,
                updated_at: new Date(),
              },
            });
          })
        );
        logger.info(`Updated batch ${index + 1}/${updateChunks.length} (${batch.length} products)`);
      }

      // Extract all reviews
      const allReviews: Array<{
        user_id: number;
        product_id: number;
        rating: number;
        comment: string;
      }> = [];

      productData.forEach((product: ProductResponse) => {
        product.reviews?.forEach((review: ReviewResponse) => {
          allReviews.push({
            user_id: review.user_id,
            product_id: product.product_id,
            rating: review.rating,
            comment: review.comment,
          });
        });
      });

      // Bulk upsert reviews
      if (allReviews.length > 0) {
        await Promise.all(
          allReviews.map(review =>
            tx.productReview.upsert({
              where: {
                user_id_product_id: {
                  user_id: review.user_id,
                  product_id: review.product_id,
                },
              },
              update: {
                rating: review.rating,
                comment: review.comment,
              },
              create: review,
            })
          )
        );
        logger.info(`Upserted ${allReviews.length} reviews`);
      }
    });

    logger.info('Bulk sync completed', {
      totalProducts: productData.length,
      created: productsToCreate.length,
      updated: productsToUpdate.length,
      users: allUsers.size,
      reviews: productData.reduce((sum: number, p: ProductResponse) => sum + (p.reviews?.length || 0), 0),
    });

    const duration = Date.now() - startTime;
    logger.info('Finished scheduled sync', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  },
});