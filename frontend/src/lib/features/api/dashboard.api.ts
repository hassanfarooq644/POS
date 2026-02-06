import { apiSlice } from './apiSlice'

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLowStock: builder.query({
            query: () => '/reports/low-stock',
            providesTags: ['Products'],
        }),
        getSalesSummary: builder.query({
            query: ({ from, to }) => `/reports/sales-summary?from=${from}&to=${to}`,
            providesTags: ['Sales'],
        }),
        getDashboardStats: builder.query({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                const today = new Date().toISOString().split('T')[0]

                const [productsRes, lowStockRes, salesRes] = await Promise.all([
                    fetchWithBQ('/products'),
                    fetchWithBQ('/reports/low-stock'),
                    fetchWithBQ(`/reports/sales-summary?from=${today}&to=${today}`)
                ])

                if (productsRes.error) return { error: productsRes.error as any }
                if (lowStockRes.error) return { error: lowStockRes.error as any }
                if (salesRes.error) return { error: salesRes.error as any }

                const productsData = productsRes.data as any
                const lowStockData = lowStockRes.data as any
                const salesData = salesRes.data as any

                return {
                    data: {
                        totalProducts: productsData.products?.length || 0,
                        lowStockCount: lowStockData.lowStockProducts?.length || 0,
                        todaySales: salesData.summary?.totalSales || 0,
                        todayRevenue: salesData.summary?.totalRevenue || 0,
                    }
                }
            },
            providesTags: ['Products', 'Sales'],
        })
    }),
})

export const {
    useGetLowStockQuery,
    useGetSalesSummaryQuery,
    useGetDashboardStatsQuery,
} = dashboardApi
