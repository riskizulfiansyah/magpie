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

interface Order {
    id: string;
    customer: string;
    amount: number;
    status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
}

interface DetailedOrder extends Order {
    email: string;
    date: string;
    items: number;
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

// Extended mock data for the dialog view
const allOrders: DetailedOrder[] = [
    { id: "1024", customer: "Alex M.", email: "alex.m@email.com", amount: 120.0, status: "Shipped", date: "2024-11-24", items: 3 },
    { id: "1023", customer: "Sarah K.", email: "sarah.k@email.com", amount: 85.5, status: "Processing", date: "2024-11-24", items: 2 },
    { id: "1022", customer: "Michael B.", email: "michael.b@email.com", amount: 210.0, status: "Delivered", date: "2024-11-23", items: 5 },
    { id: "1021", customer: "Emma W.", email: "emma.w@email.com", amount: 45.0, status: "Cancelled", date: "2024-11-23", items: 1 },
    { id: "1020", customer: "James L.", email: "james.l@email.com", amount: 315.0, status: "Shipped", date: "2024-11-22", items: 4 },
    { id: "1019", customer: "Olivia P.", email: "olivia.p@email.com", amount: 89.99, status: "Delivered", date: "2024-11-22", items: 2 },
    { id: "1018", customer: "William D.", email: "william.d@email.com", amount: 156.0, status: "Processing", date: "2024-11-21", items: 3 },
    { id: "1017", customer: "Sophia R.", email: "sophia.r@email.com", amount: 78.5, status: "Shipped", date: "2024-11-21", items: 2 },
    { id: "1016", customer: "Benjamin F.", email: "benjamin.f@email.com", amount: 430.0, status: "Delivered", date: "2024-11-20", items: 6 },
    { id: "1015", customer: "Isabella G.", email: "isabella.g@email.com", amount: 62.0, status: "Shipped", date: "2024-11-20", items: 1 },
    { id: "1014", customer: "Lucas H.", email: "lucas.h@email.com", amount: 198.0, status: "Processing", date: "2024-11-19", items: 4 },
    { id: "1013", customer: "Mia J.", email: "mia.j@email.com", amount: 55.0, status: "Cancelled", date: "2024-11-19", items: 1 },
];

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
