import { useState, useEffect, useCallback } from "react";
import { User } from "@/app/generated/prisma/client";
import { UseQueryResult, PaginatedResult } from "./types";

interface UseUsersOptions {
    page?: number;
    limit?: number;
    enabled?: boolean;
}

export function useUsers({
    page = 1,
    limit = 20,
    enabled = true,
}: UseUsersOptions = {}): UseQueryResult<PaginatedResult<User> & { users: User[] }> {
    const [data, setData] = useState<(PaginatedResult<User> & { users: User[] }) | null>(null);
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

            const response = await fetch(`/api/users?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.statusText}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, enabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}

export function useUser(id: number): UseQueryResult<User> {
    const [data, setData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/users/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
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
