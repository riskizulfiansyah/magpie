"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Product {
    name: string;
    category: string;
    price: number;
    stock: number;
}

interface TopProductsTableProps {
    products: Product[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Top Products
                </CardTitle>
                <button className="text-sm text-amber hover:text-amber-light transition-colors">
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
    );
}
