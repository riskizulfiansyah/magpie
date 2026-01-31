"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string;
    change: {
        value: string;
        isPositive: boolean;
    };
    icon: React.ReactNode;
    iconBgColor?: string;
}

export function StatsCard({
    title,
    value,
    change,
    icon,
    iconBgColor = "bg-navy-light",
}: StatsCardProps) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        <div className="flex items-center gap-1 text-sm">
                            <span
                                className={change.isPositive ? "text-success" : "text-destructive"}
                            >
                                {change.isPositive ? "↑" : "↓"}
                                {change.value}
                            </span>
                            <span className="text-muted-foreground">vs last month</span>
                        </div>
                    </div>
                    <div
                        className={`p-3 rounded-lg ${iconBgColor}`}
                    >
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
