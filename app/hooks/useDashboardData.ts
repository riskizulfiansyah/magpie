"use client";

import { useContext } from 'react';
import { DashboardDataContext } from '../contexts/DashboardDataContext';

export function useDashboardData() {
    const context = useContext(DashboardDataContext);
    if (!context) {
        throw new Error('useDashboardData must be used within DashboardDataProvider');
    }
    return context;
}
