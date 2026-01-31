import { NextRequest, NextResponse } from "next/server";
import * as orderRepo from "@/lib/repositories/orderRepository";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = Number(id);
        if (isNaN(orderId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const order = await orderRepo.getOrderById(orderId);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
