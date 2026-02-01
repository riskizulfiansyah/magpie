"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TopProduct } from "@/lib/dashboard/dashboardTypes";
import { useDashboardData } from "../hooks/useDashboardData";

interface TopProductsTableProps {
    products: TopProduct[];
}

const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: "In Stock", style: "bg-success/20 text-success border-success/30" };
    if (stock > 20) return { label: "Low Stock", style: "bg-warning/20 text-warning border-warning/30" };
    return { label: "Critical", style: "bg-destructive/20 text-destructive border-destructive/30" };
};

export function TopProductsTable({ products }: TopProductsTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data } = useDashboardData();
    const allProducts = data?.allProducts || [];

    return (
        <>
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Top Products
                    </CardTitle>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="text-sm text-amber hover:text-amber-light transition-colors"
                    >
                        View Inventory
                    </button>
                </CardHeader>
                <CardContent className="pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium">
                                    Product Name
                                </TableHead>
                                <TableHead className="text-muted-foreground font-medium">
                                    Category
                                </TableHead>
                                <TableHead className="text-muted-foreground font-medium">
                                    Price
                                </TableHead>
                                <TableHead className="text-muted-foreground font-medium text-right">
                                    Stock
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={index} className="border-border">
                                    <TableCell className="text-foreground font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground uppercase text-xs">
                                        {product.category}
                                    </TableCell>
                                    <TableCell className="text-amber font-medium">
                                        ${product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-foreground text-right">
                                        {product.stock}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[95vw] w-auto h-[80dvh] aspect-[16/10] flex flex-col bg-card border-border text-foreground p-6">
                    <DialogHeader>
                        <DialogTitle>Full Inventory</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full min-h-0 overflow-auto mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground font-medium">
                                        SKU
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Product Name
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Category
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium text-center">
                                        Rating
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium text-center">
                                        Sales
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium text-center">
                                        Stock
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allProducts.map((product) => {
                                    const stockStatus = getStockStatus(product.stock);
                                    return (
                                        <TableRow key={product.sku} className="border-border">
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {product.sku}
                                            </TableCell>
                                            <TableCell className="text-foreground font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground uppercase text-xs">
                                                {product.category}
                                            </TableCell>
                                            <TableCell className="text-amber font-medium">
                                                ${product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-amber">★</span> {product.rating}
                                            </TableCell>
                                            <TableCell className="text-foreground text-center">
                                                {product.sales.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-foreground text-center">
                                                {product.stock}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`${stockStatus.style} border`}
                                                >
                                                    {stockStatus.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
