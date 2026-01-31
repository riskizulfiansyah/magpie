"use client";

import { Navbar } from "./Navbar";
import { StatsCard } from "./StatsCard";
import { OrdersStatusChart } from "./OrdersStatusChart";
import { ProductCategoryChart } from "./ProductCategoryChart";
import { BusinessInsightsChart } from "./BusinessInsightsChart";
import { CategoryRevenueChart } from "./CategoryRevenueChart";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { TopProductsTable } from "./TopProductsTable";

// Mock data
const statsData = [
    {
        title: "Total Revenue",
        value: "$124,500",
        change: { value: "12%", isPositive: true },
        icon: (
            <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
        ),
        iconBgColor: "bg-amber/20",
    },
    {
        title: "Total Orders",
        value: "1,240",
        change: { value: "5%", isPositive: true },
        icon: (
            <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
        ),
        iconBgColor: "bg-amber/20",
    },
    {
        title: "Avg Order Value",
        value: "$98.50",
        change: { value: "2%", isPositive: false },
        icon: (
            <svg className="w-5 h-5 text-gray-light" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
        ),
        iconBgColor: "bg-navy-light",
    },
    {
        title: "Avg Rating",
        value: "4.8",
        change: { value: "0.5%", isPositive: true },
        icon: (
            <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
        iconBgColor: "bg-amber/20",
    },
];

const orderStatusData = [
    { name: "Shipped", value: 434, color: "#fca311" },
    { name: "Processing", value: 310, color: "#3b82f6" },
    { name: "Delivered", value: 310, color: "#e5e5e5" },
    { name: "Returned", value: 186, color: "#6b7280" },
];

const productCategoryData = [
    { name: "Elec", value: 180, color: "#fca311" },
    { name: "Fash", value: 140, color: "#fca311" },
    { name: "Home", value: 120, color: "#e5e5e5" },
    { name: "Beau", value: 100, color: "#e5e5e5" },
    { name: "Sport", value: 60, color: "#6b7280" },
];

const businessInsightsData = [
    { month: "Jan", thisYear: 20000, lastYear: 15000 },
    { month: "Feb", thisYear: 25000, lastYear: 18000 },
    { month: "Mar", thisYear: 22000, lastYear: 20000 },
    { month: "Apr", thisYear: 28000, lastYear: 22000 },
    { month: "May", thisYear: 32000, lastYear: 25000 },
    { month: "Jun", thisYear: 30000, lastYear: 28000 },
    { month: "Jul", thisYear: 35000, lastYear: 30000 },
    { month: "Aug", thisYear: 40000, lastYear: 32000 },
    { month: "Sep", thisYear: 45000, lastYear: 35000 },
    { month: "Oct", thisYear: 50000, lastYear: 38000 },
    { month: "Nov", thisYear: 55000, lastYear: 42000 },
    { month: "Dec", thisYear: 65000, lastYear: 45000 },
];

const categoryRevenueData = [
    { name: "Electronics", revenue: 45200, color: "#fca311" },
    { name: "Fashion", revenue: 32150, color: "#fca311" },
    { name: "Home", revenue: 18400, color: "#e5e5e5" },
    { name: "Beauty", revenue: 12300, color: "#e5e5e5" },
    { name: "Sports", revenue: 8500, color: "#6b7280" },
];

const recentOrders = [
    { id: "1024", customer: "Alex M.", amount: 120.0, status: "Shipped" as const },
    { id: "1023", customer: "Sarah K.", amount: 85.5, status: "Processing" as const },
    { id: "1022", customer: "Michael B.", amount: 210.0, status: "Delivered" as const },
    { id: "1021", customer: "Emma W.", amount: 45.0, status: "Cancelled" as const },
    { id: "1020", customer: "James L.", amount: 315.0, status: "Shipped" as const },
];

const topProducts = [
    { name: "Wireless Buds Pro", category: "Electronics", price: 129.99, stock: 45 },
    { name: "Classic Leather Jacket", category: "Fashion", price: 249.5, stock: 12 },
    { name: "Smart Home Hub", category: "Home", price: 89.0, stock: 108 },
    { name: "Running Sneakers", category: "Sports", price: 110.0, stock: 32 },
    { name: "Vitamin C Serum", category: "Beauty", price: 35.0, stock: 215 },
];

export function Dashboard() {
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
                    <div className="flex items-center gap-2 px-4 py-2 bg-navy-dark border border-border rounded-lg">
                        <svg
                            className="w-4 h-4 text-muted-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm text-foreground">Oct 24 - Nov 24</span>
                        <svg
                            className="w-4 h-4 text-muted-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
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
                    <OrdersStatusChart data={orderStatusData} total={1240} />
                    <ProductCategoryChart data={productCategoryData} />
                </div>

                {/* Business Insights */}
                <div className="mb-6">
                    <BusinessInsightsChart data={businessInsightsData} yoyChange="+16%" />
                </div>

                {/* Category Revenue */}
                <div className="mb-6">
                    <CategoryRevenueChart data={categoryRevenueData} />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RecentOrdersTable orders={recentOrders} />
                    <TopProductsTable products={topProducts} />
                </div>
            </main>
        </div>
    );
}
