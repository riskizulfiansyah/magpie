import prisma from "@/lib/prisma";
import { ProductResponse } from "@/lib/types";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { fetchProductsFromExternalApi } from "@/lib/services/external/productApiService";
import * as productRepo from "@/lib/repositories/productRepository";
import * as userRepo from "@/lib/repositories/userRepository";
import * as reviewRepo from "@/lib/repositories/reviewRepository";

function extractUniqueUsers(productData: ProductResponse[]) {
  const allUsers = new Map<number, { id: number; name: string; email: string, created_at: Date }>();
  productData.forEach((product) => {
    product.reviews?.forEach((review) => {
      if (!allUsers.has(review.user_id)) {
        allUsers.set(review.user_id, {
          id: review.user_id,
          name: `User ${review.user_id}`,
          email: `user${review.user_id}@example.com`,
          created_at: new Date(),
        });
      }
    });
  });
  return allUsers;
}

function extractAllReviews(productData: ProductResponse[]) {
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

export const syncProduct = schedules.task({
  id: "sync-product",
  cron: "0 * * * *",
  maxDuration: 300,
  run: async (payload) => {
    const startTime = Date.now();

    logger.info("Starting scheduled sync", {
      timestamp: new Date().toISOString(),
      payload
    });

    // Fetch from external API
    const productData = await fetchProductsFromExternalApi();

    // Extract unique users and reviews
    const allUsers = extractUniqueUsers(productData);
    const allReviews = extractAllReviews(productData);

    // Group products by existence
    const productIds = productData.map((p) => p.product_id);
    const { existing: existingProductIds } = await productRepo.groupProductsByExistence(productIds);

    const productsToCreate = productData.filter((p) => !existingProductIds.has(p.product_id));
    const productsToUpdate = productData.filter((p) => existingProductIds.has(p.product_id));

    // Execute bulk operations in two phases
    // Phase 1: Users and Products (master data)
    await prisma.$transaction(async (tx) => {
      await userRepo.createUsers(tx, Array.from(allUsers.values()));
      await productRepo.createProducts(tx, productsToCreate);
      await productRepo.updateProducts(tx, productsToUpdate);
    });

    logger.info("Product sync completed successfully", {
      totalProducts: productData.length,
      created: productsToCreate.length,
      updated: productsToUpdate.length,
      users: allUsers.size,
    });

    // Phase 2: Reviews (dependent data)
    await prisma.$transaction(async (tx) => {
      const reviewsToCreate = await reviewRepo.groupReviewsByExistence(tx, allReviews);
      await reviewRepo.createReviews(tx, reviewsToCreate);
    });

    logger.info("Bulk sync completed", {
      totalProducts: productData.length,
      created: productsToCreate.length,
      updated: productsToUpdate.length,
      users: allUsers.size,
      reviews: allReviews.length,
    });

    const duration = Date.now() - startTime;
    logger.info("Finished scheduled sync", {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  },
});