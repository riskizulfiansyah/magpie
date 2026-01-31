import { NextRequest, NextResponse } from "next/server";
import * as orderRepo from "@/lib/repositories/orderRepository";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const status = searchParams.get("status") || undefined;
        const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : undefined;

        const result = await orderRepo.getOrders(page, limit, { status, userId });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
