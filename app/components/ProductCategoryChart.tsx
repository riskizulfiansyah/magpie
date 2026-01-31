"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle, Tooltip } from "./ChartsWrapper";

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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
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
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
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

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] w-auto h-[80dvh] aspect-[16/10] flex flex-col bg-card border-border text-foreground p-6">
                    <DialogHeader>
                        <DialogTitle>Product Count by Category</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden mt-4">
                        <div className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} barSize={100} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#e5e5e5", fontSize: 14 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#e5e5e5", fontSize: 14 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            backgroundColor: "#14213d",
                                            border: "1px solid #2a3a5a",
                                            borderRadius: "8px",
                                            color: "#ffffff",
                                        }}
                                        itemStyle={{ color: "#ffffff" }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        shape={<CustomBar />}
                                        background={{ fill: "#1c2d4f" }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
