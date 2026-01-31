"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "./ChartsWrapper";

interface OrderStatusData {
    name: string;
    value: number;
    color: string;
}

interface OrdersStatusChartProps {
    data: OrderStatusData[];
    total: number;
}

export function OrdersStatusChart({ data, total }: OrdersStatusChartProps) {
    return (
        <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Orders by Status
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Distribution of current order statuses
                    </p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-8">
                    {/* Donut Chart */}
                    <div className="relative w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-foreground">
                                {new Intl.NumberFormat("en-US").format(total)}
                            </span>
                            <span className="text-xs text-muted-foreground">TOTAL</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {item.name} ({Math.round((item.value / total) * 100)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
