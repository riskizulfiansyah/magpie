import { NextRequest, NextResponse } from "next/server";
import * as userRepo from "@/lib/repositories/userRepository";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const result = await userRepo.getUsers(page, limit);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
