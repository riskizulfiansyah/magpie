"use client";

import { Navbar } from "./Navbar";
import { StatsCard } from "./StatsCard";
import { OrdersStatusChart } from "./OrdersStatusChart";
import { ProductCategoryChart } from "./ProductCategoryChart";
import { BusinessInsightsChart } from "./BusinessInsightsChart";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { TopProductsTable } from "./TopProductsTable";
import { DashboardDataProvider } from "../contexts/DashboardDataContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { DataSourceToggle } from "./DataSourceToggle";
import { Loader2 } from "lucide-react";

function DashboardContent() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-500">Error loading dashboard data</h3>
                    <p className="text-muted-foreground">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!data && isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return null;

    const statsData = [
        {
            title: "Total Revenue",
            value: data.stats.totalRevenue > 1000
                ? `$${(data.stats.totalRevenue / 1000).toFixed(1)}k`
                : `$${data.stats.totalRevenue.toFixed(2)}`,
            change: { value: `${data.stats.revenueChange}%`, isPositive: data.stats.revenueChange >= 0 },
            icon: (
                <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            ),
            iconBgColor: "bg-amber/20",
        },
        {
            title: "Total Orders",
            value: data.stats.totalOrders.toLocaleString(),
            change: { value: `${data.stats.ordersChange}%`, isPositive: data.stats.ordersChange >= 0 },
            icon: (
                <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
            ),
            iconBgColor: "bg-amber/20",
        },
        {
            title: "Avg Order Value",
            value: `$${data.stats.avgOrderValue.toFixed(2)}`,
            change: { value: `${data.stats.avgOrderChange}%`, isPositive: data.stats.avgOrderChange >= 0 },
            icon: (
                <svg className="w-5 h-5 text-gray-light" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
            ),
            iconBgColor: "bg-navy-light",
        },
        {
            title: "Avg Rating",
            value: data.stats.avgRating.toFixed(1),
            change: { value: `${data.stats.ratingChange}%`, isPositive: data.stats.ratingChange >= 0 },
            icon: (
                <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ),
            iconBgColor: "bg-amber/20",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome back, here&apos;s what&apos;s happening with your store today.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <DataSourceToggle />

                        <div className="flex items-center gap-2 px-4 py-2 bg-navy-dark border border-border rounded-lg">
                            <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-foreground">Today</span>
                            <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statsData.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            change={stat.change}
                            icon={stat.icon}
                            iconBgColor={stat.iconBgColor}
                        />
                    ))}
                </div>

                {/* Orders Status & Product Category Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <OrdersStatusChart data={data.orderStatus} total={data.stats.totalOrders} />
                    <ProductCategoryChart data={data.productCategory} />
                </div>

                {/* Business Insights */}
                <div className="mb-6">
                    <BusinessInsightsChart
                        data={data.businessInsights}
                        yoyChange={data.stats.revenueChange > 0 ? `+${data.stats.revenueChange}%` : `${data.stats.revenueChange}%`}
                        categoryData={data.categoryRevenue}
                    />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RecentOrdersTable orders={data.recentOrders} />
                    <TopProductsTable products={data.topProducts} />
                </div>
            </main>
        </div>
    );
}

export function Dashboard() {
    return (
        <DashboardDataProvider>
            <DashboardContent />
        </DashboardDataProvider>
    );
}

