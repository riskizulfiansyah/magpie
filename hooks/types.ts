export interface UseQueryResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export interface PaginatedResult<T> {
    [key: string]: T[] | number; // Generic index signature to handle 'orders', 'products', 'users' keys
    total: number;
}
