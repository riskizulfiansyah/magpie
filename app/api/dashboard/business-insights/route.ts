import { NextResponse } from "next/server";
import { BusinessInsightsRepository } from "@/lib/repositories/businessInsightsRepository";

export async function GET() {
    try {
        const repo = new BusinessInsightsRepository();
        const revenueData = await repo.getMonthlyRevenue();

        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        const monthlyData = new Array(12).fill(0).map((_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            thisYear: 0,
            lastYear: 0,
        }));

        for (const row of revenueData) {
            const date = new Date(row.month);
            const year = date.getFullYear();
            const monthIndex = date.getMonth();

            if (year === currentYear) {
                monthlyData[monthIndex].thisYear = Number(row.revenue.toFixed(2));
            } else if (year === lastYear) {
                monthlyData[monthIndex].lastYear = Number(row.revenue.toFixed(2));
            }
        }

        return NextResponse.json(monthlyData);
    } catch (error) {
        console.error("Error fetching business insights:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
