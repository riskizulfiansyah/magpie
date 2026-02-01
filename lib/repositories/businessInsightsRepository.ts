import prisma from "@/lib/prisma";

export interface MonthlyRevenueResult {
    month: Date;
    revenue: number;
}

export class BusinessInsightsRepository {
    async getMonthlyRevenue(): Promise<MonthlyRevenueResult[]> {
        // raw query to select from view
        const result = await prisma.$queryRaw`SELECT month, revenue FROM monthly_revenue ORDER BY month ASC`;
        return result as MonthlyRevenueResult[];
    }
}
