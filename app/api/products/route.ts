import { NextRequest, NextResponse } from "next/server";
import * as productRepo from "@/lib/repositories/productRepository";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const filters = {
            category: searchParams.get("category") || undefined,
            brand: searchParams.get("brand") || undefined,
            minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
            availability: searchParams.has("availability")
                ? searchParams.get("availability") === "true"
                : undefined,
        };

        const result = await productRepo.getProducts(page, limit, filters);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
