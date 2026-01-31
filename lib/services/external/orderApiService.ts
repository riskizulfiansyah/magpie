import { OrderResponse } from "@/lib/types";

export async function fetchOrdersFromExternalApi(): Promise<OrderResponse[]> {
    try {
        const response = await fetch(process.env.ORDER_API_URL as string);
        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        return (await response.json()) as OrderResponse[];
    } catch (error) {
        console.error("Error fetching orders from external API:", error);
        throw error;
    }
}
