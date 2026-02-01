import {
    DashboardStats,
    OrderStatusData,
    ProductCategoryData,
    BusinessInsightsData,
    CategoryRevenueData,
    RecentOrder,
    TopProduct,
    DashboardData,
    DetailedOrder,
    DetailedProduct
} from "./dashboardTypes";

export interface IDashboardDataService {
    getStats(): Promise<DashboardStats>;
    getOrderStatus(): Promise<OrderStatusData[]>;
    getProductCategory(): Promise<ProductCategoryData[]>;
    getBusinessInsights(): Promise<BusinessInsightsData[]>;
    getCategoryRevenue(): Promise<CategoryRevenueData[]>;
    getRecentOrders(): Promise<RecentOrder[]>;
    getTopProducts(): Promise<TopProduct[]>;
    getAllOrders(): Promise<DetailedOrder[]>;
    getAllProducts(): Promise<DetailedProduct[]>;
    getAllData(): Promise<DashboardData>;
}
