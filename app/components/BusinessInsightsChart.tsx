"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils/formatters";
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "./ChartsWrapper";

interface InsightData {
    month: string;
    thisYear: number;
    lastYear: number;
}

interface CategoryRevenueData {
    name: string;
    revenue: number;
    color: string;
}

interface BusinessInsightsChartProps {
    data: InsightData[];
    yoyChange: string;
    categoryData: CategoryRevenueData[];
}

const RevenueChart = ({ data, showYAxis = false }: { data: InsightData[]; showYAxis?: boolean }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fca311" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#fca311" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#e5e5e5", fontSize: 12 }}
                />
                <YAxis hide={!showYAxis} tick={{ fill: "#e5e5e5", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                    formatter={(value: number | undefined) => [formatCurrency(value || 0), undefined]}
                    contentStyle={{
                        backgroundColor: "#14213d",
                        border: "1px solid #2a3a5a",
                        borderRadius: "8px",
                        color: "#ffffff",
                    }}
                    labelStyle={{ color: "#e5e5e5" }}
                />
                <Area
                    type="monotone"
                    dataKey="thisYear"
                    name="This Year"
                    stroke="#fca311"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                    activeDot={{ r: 6, fill: "#fca311", stroke: "#14213d", strokeWidth: 2 }}
                />
                <Line
                    type="monotone"
                    dataKey="lastYear"
                    name="Last Year"
                    stroke="#e5e5e5"
                    // ... (skip lines 74-84)
                    activeDot={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const CategoryList = ({ categoryData, maxRevenue }: { categoryData: CategoryRevenueData[]; maxRevenue: number }) => {
    return (
        <div className="space-y-3">
            {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground truncate">
                        {item.name}
                    </span>
                    <div className="flex-1 h-8 bg-navy-dark rounded relative overflow-hidden">
                        <div
                            className="h-full rounded transition-all duration-500"
                            style={{
                                width: `${(item.revenue / maxRevenue) * 100}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    </div>
                    <span className="w-20 text-right text-sm font-medium text-foreground">
                        {formatCurrency(item.revenue)}
                    </span>
                </div>
            ))}
        </div>
    );
};

export function BusinessInsightsChart({
    data,
    yoyChange,
    categoryData,
}: BusinessInsightsChartProps) {
    const [activeChart, setActiveChart] = useState<"revenue" | "category" | null>(null);
    const maxRevenue = Math.max(...categoryData.map((d) => d.revenue));

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Business Insights
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Combined revenue analysis and category leaders
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-amber"></div>
                        <span className="text-sm text-muted-foreground">This Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-gray-light/50"></div>
                        <span className="text-sm text-muted-foreground">Last Year</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col gap-8">
                    {/* Revenue Performance Line Chart */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    Revenue Performance
                                </span>
                                <span className="px-2 py-1 text-xs font-medium text-success bg-success/20 rounded">
                                    {yoyChange} YoY
                                </span>
                            </div>
                            <button
                                onClick={() => setActiveChart("revenue")}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-56">
                            <RevenueChart data={data} />
                        </div>
                    </div>

                    {/* Top 5 Product Categories */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Top 5 Product Categories (Revenue Contribution)
                            </span>
                            <button
                                onClick={() => setActiveChart("category")}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                        </div>
                        <CategoryList categoryData={categoryData} maxRevenue={maxRevenue} />
                    </div>
                </div>
            </CardContent>

            <Dialog open={activeChart !== null} onOpenChange={(open) => !open && setActiveChart(null)}>
                <DialogContent className="max-w-[95vw] w-auto h-[80dvh] aspect-[16/10] flex flex-col bg-card border-border text-foreground p-6">
                    <DialogHeader>
                        <DialogTitle>
                            {activeChart === "revenue" ? "Revenue Performance Analysis" : "Category Revenue Distribution"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden mt-4">
                        <div className="w-full h-full">
                            {activeChart === "revenue" && (
                                <RevenueChart data={data} showYAxis={true} />
                            )}
                            {activeChart === "category" && (
                                <div className="h-full overflow-y-auto pr-2 bg-card border border-border rounded-lg p-4">
                                    <CategoryList categoryData={categoryData} maxRevenue={maxRevenue} />
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
