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

export class SampleDataService implements IDashboardDataService {
    async getStats(): Promise<DashboardStats> {
        return {
            totalRevenue: 124500,
            totalOrders: 1240,
            avgOrderValue: 98.50,
            avgRating: 4.8,
            revenueChange: 12,
            ordersChange: 5,
            avgOrderChange: -2,
            ratingChange: 0.5,
        };
    }

    async getOrderStatus(): Promise<OrderStatusData[]> {
        return [
            { name: "Shipped", value: 434, color: "#fca311" },
            { name: "Processing", value: 310, color: "#3b82f6" },
            { name: "Delivered", value: 310, color: "#e5e5e5" },
            { name: "Returned", value: 186, color: "#6b7280" },
        ];
    }

    async getProductCategory(): Promise<ProductCategoryData[]> {
        return [
            { name: "Elec", value: 180, color: "#fca311" },
            { name: "Fash", value: 140, color: "#fca311" },
            { name: "Home", value: 120, color: "#e5e5e5" },
            { name: "Beau", value: 100, color: "#e5e5e5" },
            { name: "Sport", value: 60, color: "#6b7280" },
        ];
    }

    async getBusinessInsights(): Promise<BusinessInsightsData[]> {
        return [
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
    }

    async getCategoryRevenue(): Promise<CategoryRevenueData[]> {
        return [
            { name: "Electronics", revenue: 45200, color: "#fca311" },
            { name: "Fashion", revenue: 32150, color: "#fca311" },
            { name: "Home", revenue: 18400, color: "#e5e5e5" },
            { name: "Beauty", revenue: 12300, color: "#e5e5e5" },
            { name: "Sports", revenue: 8500, color: "#6b7280" },
        ];
    }

    async getRecentOrders(): Promise<RecentOrder[]> {
        return [
            { id: "1024", customer: "Alex M.", amount: 120.0, status: "Shipped" },
            { id: "1023", customer: "Sarah K.", amount: 85.5, status: "Processing" },
            { id: "1022", customer: "Michael B.", amount: 210.0, status: "Delivered" },
            { id: "1021", customer: "Emma W.", amount: 45.0, status: "Cancelled" },
            { id: "1020", customer: "James L.", amount: 315.0, status: "Shipped" },
        ];
    }

    async getTopProducts(): Promise<TopProduct[]> {
        return [
            { name: "Wireless Buds Pro", category: "Electronics", price: 129.99, stock: 45 },
            { name: "Classic Leather Jacket", category: "Fashion", price: 249.5, stock: 12 },
            { name: "Smart Home Hub", category: "Home", price: 89.0, stock: 108 },
            { name: "Running Sneakers", category: "Sports", price: 110.0, stock: 32 },
            { name: "Vitamin C Serum", category: "Beauty", price: 35.0, stock: 215 },
        ];
    }

    async getAllOrders(): Promise<DetailedOrder[]> {
        return [
            { id: "1024", userId: 1, customer: "Alex M.", email: "alex.m@email.com", amount: 120.0, status: "Shipped", date: "2024-11-24", items: 3 },
            { id: "1023", userId: 2, customer: "Sarah K.", email: "sarah.k@email.com", amount: 85.5, status: "Processing", date: "2024-11-24", items: 2 },
            { id: "1022", userId: 3, customer: "Michael B.", email: "michael.b@email.com", amount: 210.0, status: "Delivered", date: "2024-11-23", items: 5 },
            { id: "1021", userId: 4, customer: "Emma W.", email: "emma.w@email.com", amount: 45.0, status: "Cancelled", date: "2024-11-23", items: 1 },
            { id: "1020", userId: 5, customer: "James L.", email: "james.l@email.com", amount: 315.0, status: "Shipped", date: "2024-11-22", items: 4 },
            { id: "1019", userId: 6, customer: "Olivia P.", email: "olivia.p@email.com", amount: 89.99, status: "Delivered", date: "2024-11-22", items: 2 },
            { id: "1018", userId: 7, customer: "William D.", email: "william.d@email.com", amount: 156.0, status: "Processing", date: "2024-11-21", items: 3 },
            { id: "1017", userId: 8, customer: "Sophia R.", email: "sophia.r@email.com", amount: 78.5, status: "Shipped", date: "2024-11-21", items: 2 },
            { id: "1016", userId: 9, customer: "Benjamin F.", email: "benjamin.f@email.com", amount: 430.0, status: "Delivered", date: "2024-11-20", items: 6 },
            { id: "1015", userId: 10, customer: "Isabella G.", email: "isabella.g@email.com", amount: 62.0, status: "Shipped", date: "2024-11-20", items: 1 },
            { id: "1014", userId: 11, customer: "Lucas H.", email: "lucas.h@email.com", amount: 198.0, status: "Processing", date: "2024-11-19", items: 4 },
            { id: "1013", userId: 12, customer: "Mia J.", email: "mia.j@email.com", amount: 55.0, status: "Cancelled", date: "2024-11-19", items: 1 },
        ];
    }

    async getAllProducts(): Promise<DetailedProduct[]> {
        return [
            { sku: "WBP-001", name: "Wireless Buds Pro", category: "Electronics", price: 129.99, stock: 45, rating: 4.8, sales: 1250 },
            { sku: "CLJ-002", name: "Classic Leather Jacket", category: "Fashion", price: 249.50, stock: 12, rating: 4.6, sales: 340 },
            { sku: "SHH-003", name: "Smart Home Hub", category: "Home", price: 89.00, stock: 108, rating: 4.5, sales: 890 },
            { sku: "RSN-004", name: "Running Sneakers", category: "Sports", price: 110.00, stock: 32, rating: 4.7, sales: 520 },
            { sku: "VCS-005", name: "Vitamin C Serum", category: "Beauty", price: 35.00, stock: 215, rating: 4.9, sales: 2100 },
            { sku: "WCH-006", name: "Wireless Charger Stand", category: "Electronics", price: 45.00, stock: 78, rating: 4.4, sales: 680 },
            { sku: "YGM-007", name: "Yoga Mat Premium", category: "Sports", price: 55.00, stock: 156, rating: 4.6, sales: 420 },
            { sku: "SLK-008", name: "Silk Pillowcase Set", category: "Home", price: 65.00, stock: 89, rating: 4.7, sales: 310 },
            { sku: "DRS-009", name: "Designer Sunglasses", category: "Fashion", price: 189.00, stock: 18, rating: 4.5, sales: 180 },
            { sku: "FCS-010", name: "Face Cream SPF 50", category: "Beauty", price: 42.00, stock: 165, rating: 4.8, sales: 950 },
            { sku: "BTH-011", name: "Bluetooth Speaker", category: "Electronics", price: 79.99, stock: 52, rating: 4.6, sales: 720 },
            { sku: "DMB-012", name: "Dumbbell Set", category: "Sports", price: 125.00, stock: 25, rating: 4.4, sales: 280 },
        ];
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
