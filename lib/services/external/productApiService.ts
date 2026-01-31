import { ProductResponse } from "@/lib/types";

export async function fetchProductsFromExternalApi(): Promise<ProductResponse[]> {
    try {
        const response = await fetch(process.env.PRODUCT_API_URL as string);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        return (await response.json()) as ProductResponse[];
    } catch (error) {
        console.error("Error fetching products from external API:", error);
        throw error;
    }
}
