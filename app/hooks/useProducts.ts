import { useState, useEffect, useCallback } from "react";
import { Product } from "@/app/generated/prisma/client";
import { UseQueryResult, PaginatedResult } from "./types";

interface UseProductsOptions {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: boolean;
    enabled?: boolean;
}

export function useProducts({
    page = 1,
    limit = 20,
    category,
    brand,
    minPrice,
    maxPrice,
    availability,
    enabled = true,
}: UseProductsOptions = {}): UseQueryResult<PaginatedResult<Product> & { products: Product[] }> {
    const [data, setData] = useState<(PaginatedResult<Product> & { products: Product[] }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (category) params.append("category", category);
            if (brand) params.append("brand", brand);
            if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
            if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
            if (availability !== undefined) params.append("availability", availability.toString());

            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, category, brand, minPrice, maxPrice, availability, enabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}

export function useProduct(id: number): UseQueryResult<Product> {
    const [data, setData] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching product: ${response.statusText}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}
