import { NextRequest, NextResponse } from "next/server";
import * as productRepo from "@/lib/repositories/productRepository";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = Number(id);
        if (isNaN(productId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const product = await productRepo.getProductById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
