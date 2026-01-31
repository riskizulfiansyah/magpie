import { useState, useEffect, useCallback } from "react";
import { Order } from "@/app/generated/prisma/client";
import { UseQueryResult, PaginatedResult } from "./types";

interface UseOrdersOptions {
    page?: number;
    limit?: number;
    status?: string;
    userId?: number;
    enabled?: boolean;
}

export function useOrders({
    page = 1,
    limit = 20,
    status,
    userId,
    enabled = true,
}: UseOrdersOptions = {}): UseQueryResult<PaginatedResult<Order> & { orders: Order[] }> {
    const [data, setData] = useState<(PaginatedResult<Order> & { orders: Order[] }) | null>(null);
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
            if (status) params.append("status", status);
            if (userId) params.append("userId", userId.toString());

            const response = await fetch(`/api/orders?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching orders: ${response.statusText}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, status, userId, enabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}

export function useOrder(id: number): UseQueryResult<Order> {
    const [data, setData] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/orders/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching order: ${response.statusText}`);
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
