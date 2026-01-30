import { chunk } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { ProductResponse } from "@/lib/types";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { Prisma } from "@/app/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

export async function fetchProductData(): Promise<ProductResponse[]> {
  const response = await fetch(process.env.PRODUCT_API_URL as string);
  return (await response.json()) as ProductResponse[];
}

export function extractUniqueUsers(productData: ProductResponse[]) {
  const allUsers = new Map<number, { id: number; name: string; email: string }>();
  productData.forEach((product) => {
    product.reviews?.forEach((review) => {
      if (!allUsers.has(review.user_id)) {
        allUsers.set(review.user_id, {
          id: review.user_id,
          name: `User ${review.user_id}`,
          email: `user${review.user_id}@example.com`,
        });
      }
    });
  });
  return allUsers;
}

export async function groupProductsByExistence(productData: ProductResponse[]) {
  const productIds = productData.map((p) => p.product_id);
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true },
  });
  const existingProductIds = new Set(existingProducts.map((p) => p.id));

  const productsToCreate = productData.filter((p) => !existingProductIds.has(p.product_id));
  const productsToUpdate = productData.filter((p) => existingProductIds.has(p.product_id));

  return { productsToCreate, productsToUpdate };
}

export function extractAllReviews(productData: ProductResponse[]) {
  const allReviews: Array<{
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
  }> = [];

  productData.forEach((product) => {
    product.reviews?.forEach((review) => {
      allReviews.push({
        user_id: review.user_id,
        product_id: product.product_id,
        rating: review.rating,
        comment: review.comment,
      });
    });
  });
  return allReviews;
}

export async function saveUsers(tx: TransactionClient, users: Map<number, { id: number; name: string; email: string }>) {
  if (users.size > 0) {
    await tx.user.createMany({
      data: Array.from(users.values()),
      skipDuplicates: true,
    });
    logger.info(`Processed ${users.size} users (skipDuplicates)`);
  }
}

export async function saveNewProducts(tx: TransactionClient, productsToCreate: ProductResponse[]) {
  const BATCH_SIZE = 50;
  const createChunks = chunk(productsToCreate, BATCH_SIZE);
  for (const [index, batch] of createChunks.entries()) {
    await tx.product.createMany({
      data: batch.map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}

export async function updateExistingProducts(tx: TransactionClient, productsToUpdate: ProductResponse[]) {
  const BATCH_SIZE = 50;
  const updateChunks = chunk(productsToUpdate, BATCH_SIZE);
  for (const [index, batch] of updateChunks.entries()) {
    await Promise.all(
      batch.map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}

export async function saveReviews(tx: TransactionClient, allReviews: ReturnType<typeof extractAllReviews>) {
  if (allReviews.length > 0) {
    await Promise.all(
      allReviews.map((review) =>
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
}

export const syncProduct = schedules.task({
  id: "sync-product",
  cron: "0 * * * *",
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    const startTime = Date.now();

    logger.info("Starting scheduled sync", {
      timestamp: new Date().toISOString(),
    });

    const productData = await fetchProductData();

    // Extract all unique users from reviews
    const allUsers = extractUniqueUsers(productData);

    // Get existing products to determine create vs update
    const { productsToCreate, productsToUpdate } = await groupProductsByExistence(productData);

    // Execute bulk operations in transaction
    await prisma.$transaction(async (tx) => {
      await saveUsers(tx, allUsers);
      await saveNewProducts(tx, productsToCreate);
      await updateExistingProducts(tx, productsToUpdate);

      const allReviews = extractAllReviews(productData);
      await saveReviews(tx, allReviews);
    });

    logger.info("Bulk sync completed", {
      totalProducts: productData.length,
      created: productsToCreate.length,
      updated: productsToUpdate.length,
      users: allUsers.size,
      reviews: productData.reduce((sum: number, p) => sum + (p.reviews?.length || 0), 0),
    });

    const duration = Date.now() - startTime;
    logger.info("Finished scheduled sync", {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  },
});