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
import { RecentOrder } from "@/lib/dashboard/dashboardTypes";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatUserId } from "@/lib/utils/formatters";

interface RecentOrdersTableProps {
    orders: RecentOrder[];
}

const statusStyles = {
    Shipped: "bg-info/20 text-info border-info/30",
    Processing: "bg-warning/20 text-warning border-warning/30",
    Delivered: "bg-success/20 text-success border-success/30",
    Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data } = useDashboardData();
    const allOrders = data?.allOrders || [];

    return (
        <>
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Recent Orders
                    </CardTitle>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="text-sm text-amber hover:text-amber-light transition-colors"
                    >
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[95vw] w-auto h-[80dvh] aspect-[16/10] flex flex-col bg-card border-border text-foreground p-6">
                    <DialogHeader>
                        <DialogTitle>All Orders</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full min-h-0 overflow-auto mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground font-medium">
                                        Order ID
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        User ID
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Customer
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Email
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-medium">
                                        Items
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
                                {allOrders.map((order) => (
                                    <TableRow key={order.id} className="border-border">
                                        <TableCell className="text-foreground font-medium">
                                            #{order.id}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {formatUserId(order.userId)}
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            {order.customer}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {order.email}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {order.date}
                                        </TableCell>
                                        <TableCell className="text-foreground text-center">
                                            {order.items}
                                        </TableCell>
                                        <TableCell className="text-amber font-medium">
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
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
