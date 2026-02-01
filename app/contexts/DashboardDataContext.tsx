"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardData } from '@/lib/dashboard/dashboardTypes';
import { IDashboardDataService } from '@/lib/dashboard/DashboardDataService';
import { SampleDataService } from '@/lib/dashboard/SampleDataService';
import { RealDataService } from '@/lib/dashboard/RealDataService';

interface DashboardDataContextValue {
    isRealData: boolean;
    setIsRealData: (value: boolean) => void;
    data: DashboardData | null;
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}

export const DashboardDataContext = createContext<DashboardDataContextValue | undefined>(undefined);

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRealData, setIsRealData] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const service = useMemo<IDashboardDataService>(() =>
        isRealData ? new RealDataService() : new SampleDataService(),
        [isRealData]
    );

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await service.getAllData();
            setData(result);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, [service]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DashboardDataContext.Provider value={{
            isRealData,
            setIsRealData,
            data,
            isLoading,
            error,
            refresh: fetchData,
        }}>
            {children}
        </DashboardDataContext.Provider>
    );
};
