import {
    IDashboardDataService
} from "./DashboardDataService";
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

export class RealDataService implements IDashboardDataService {
    private async fetchData<T>(endpoint: string): Promise<T> {
        const response = await fetch(`/api/dashboard/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }
        return response.json();
    }

    async getStats(): Promise<DashboardStats> {
        return this.fetchData<DashboardStats>('stats');
    }

    async getOrderStatus(): Promise<OrderStatusData[]> {
        return this.fetchData<OrderStatusData[]>('orders/status');
    }

    async getProductCategory(): Promise<ProductCategoryData[]> {
        return this.fetchData<ProductCategoryData[]>('products/category');
    }

    async getBusinessInsights(): Promise<BusinessInsightsData[]> {
        return this.fetchData<BusinessInsightsData[]>('business-insights');
    }

    async getCategoryRevenue(): Promise<CategoryRevenueData[]> {
        return this.fetchData<CategoryRevenueData[]>('products/category-revenue');
    }

    async getRecentOrders(): Promise<RecentOrder[]> {
        return this.fetchData<RecentOrder[]>('orders/recent');
    }

    async getTopProducts(): Promise<TopProduct[]> {
        return this.fetchData<TopProduct[]>('products/top');
    }

    async getAllOrders(): Promise<DetailedOrder[]> {
        return this.fetchData<DetailedOrder[]>('orders/all');
    }

    async getAllProducts(): Promise<DetailedProduct[]> {
        return this.fetchData<DetailedProduct[]>('products/all');
    }

    async getAllData(): Promise<DashboardData> {
        const [
            stats,
            orderStatus,
            productCategory,
            businessInsights,
            categoryRevenue,
            recentOrders,
            topProducts,
            allOrders,
            allProducts
        ] = await Promise.all([
            this.getStats(),
            this.getOrderStatus(),
            this.getProductCategory(),
            this.getBusinessInsights(),
            this.getCategoryRevenue(),
            this.getRecentOrders(),
            this.getTopProducts(),
            this.getAllOrders(),
            this.getAllProducts()
        ]);

        return {
            stats,
            orderStatus,
            productCategory,
            businessInsights,
            categoryRevenue,
            recentOrders,
            topProducts,
            allOrders,
            allProducts
        };
    }
}
