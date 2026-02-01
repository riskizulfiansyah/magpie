export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    avgRating: number;
    revenueChange: number;    // percentage
    ordersChange: number;     // percentage
    avgOrderChange: number;   // percentage
    ratingChange: number;     // percentage
}

export interface OrderStatusData {
    name: string;
    value: number;
    color: string;
}

export interface ProductCategoryData {
    name: string;
    value: number;
    color: string;
}

export interface BusinessInsightsData {
    month: string;
    thisYear: number;
    lastYear: number;
}

export interface CategoryRevenueData {
    name: string;
    revenue: number;
    color: string;
}

export interface RecentOrder {
    id: string;
    customer: string;
    amount: number;
    status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
}

export interface TopProduct {
    name: string;
    category: string;
    price: number;
    stock: number;
}

export interface DetailedOrder extends RecentOrder {
    userId: number; // Added for U-XXX formatting
    email: string;
    date: string;
    items: number;
}

export interface DetailedProduct extends TopProduct {
    sku: string;
    rating: number;
    sales: number;
}

export interface DashboardData {
    stats: DashboardStats;
    orderStatus: OrderStatusData[];
    productCategory: ProductCategoryData[];
    businessInsights: BusinessInsightsData[];
    categoryRevenue: CategoryRevenueData[];
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    allOrders: DetailedOrder[];
    allProducts: DetailedProduct[];
}
