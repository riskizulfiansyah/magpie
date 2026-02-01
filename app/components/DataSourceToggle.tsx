"use client";

import { useDashboardData } from "@/app/hooks/useDashboardData";
import { Switch } from "@/components/ui/switch";

export function DataSourceToggle() {
    const { isRealData, setIsRealData, isLoading } = useDashboardData();

    return (
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
            <span className={`text-sm font-medium transition-colors ${!isRealData ? 'text-foreground' : 'text-muted-foreground'}`}>
                Sample Data
            </span>
            <Switch
                checked={isRealData}
                onCheckedChange={setIsRealData}
                disabled={isLoading}
            />
            <span className={`text-sm font-medium transition-colors ${isRealData ? 'text-foreground' : 'text-muted-foreground'}`}>
                Real Data
            </span>
            {isLoading && (
                <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
        </div>
    );
}
