"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryRevenueData {
    name: string;
    revenue: number;
    color: string;
}

interface CategoryRevenueChartProps {
    data: CategoryRevenueData[];
}

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
    const maxRevenue = Math.max(...data.map((d) => d.revenue));

    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-6">
                <CardTitle className="text-sm font-medium text-muted-foreground mb-4">
                    Top 5 Product Categories (Revenue Contribution)
                </CardTitle>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <span className="w-20 text-sm text-muted-foreground truncate">
                                {item.name}
                            </span>
                            <div className="flex-1 h-6 bg-navy-dark rounded relative overflow-hidden">
                                <div
                                    className="h-full rounded transition-all duration-500"
                                    style={{
                                        width: `${(item.revenue / maxRevenue) * 100}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>
                            <span className="w-20 text-right text-sm font-medium text-foreground">
                                ${new Intl.NumberFormat("en-US").format(item.revenue)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
