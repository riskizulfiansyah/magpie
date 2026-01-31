import { Prisma } from "@/app/generated/prisma/client";
import { chunk } from "@/lib/helper";

export type TransactionClient = Prisma.TransactionClient;

/**
 * Process a list of items in batches
 * @param items Items to process
 * @param batchSize Size of each batch
 * @param processor Async function to process each batch
 */
export async function batchProcess<T>(
    items: T[],
    batchSize: number,
    processor: (batch: T[], index: number, totalBatches: number) => Promise<void>
): Promise<void> {
    const chunks = chunk(items, batchSize);
    for (const [index, batch] of chunks.entries()) {
        await processor(batch, index, chunks.length);
    }
}
