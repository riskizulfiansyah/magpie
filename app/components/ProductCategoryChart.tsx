"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle } from "./ChartsWrapper";

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface ProductCategoryChartProps {
    data: CategoryData[];
}

interface CustomBarProps {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    payload: CategoryData;
}

const CustomBar = (props: unknown) => {
    const { fill, x, y, width, height, payload } = props as CustomBarProps;
    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={payload.color || fill}
            radius={[4, 4, 0, 0]}
        />
    );
};

export function ProductCategoryChart({ data }: ProductCategoryChartProps) {
    return (
        <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Product Count by Category
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Inventory distribution across top categories
                    </p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={80}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#e5e5e5", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Bar
                                dataKey="value"
                                shape={<CustomBar />}
                                background={{ fill: "#1c2d4f" }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
