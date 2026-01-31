"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface BusinessInsightsChartProps {
    data: InsightData[];
    yoyChange: string;
}

export function BusinessInsightsChart({
    data,
    yoyChange,
}: BusinessInsightsChartProps) {
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
                <div className="mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Revenue Performance
                        </span>
                        <span className="px-2 py-1 text-xs font-medium text-success bg-success/20 rounded">
                            {yoyChange} YoY
                        </span>
                    </div>
                </div>
                <div className="h-64">
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
                            <YAxis hide />
                            <Tooltip
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
                                stroke="#fca311"
                                strokeWidth={2}
                                fill="url(#areaGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="lastYear"
                                stroke="#e5e5e5"
                                strokeWidth={1}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
