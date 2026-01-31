"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Order {
    id: string;
    customer: string;
    amount: number;
    status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
}

interface RecentOrdersTableProps {
    orders: Order[];
}

const statusStyles = {
    Shipped: "bg-info/20 text-info border-info/30",
    Processing: "bg-warning/20 text-warning border-warning/30",
    Delivered: "bg-success/20 text-success border-success/30",
    Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Recent Orders
                </CardTitle>
                <button className="text-sm text-amber hover:text-amber-light transition-colors">
                    View All
                </button>
            </CardHeader>
            <CardContent className="pt-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground font-medium">
                                Order ID
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium">
                                Customer
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium">
                                Amount
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-border">
                                <TableCell className="text-foreground font-medium">
                                    #{order.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {order.customer}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    ${order.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${statusStyles[order.status]} border`}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
