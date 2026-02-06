'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { FiPackage, FiAlertTriangle, FiTrendingUp, FiDollarSign } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'
import { useGetDashboardStatsQuery } from '@/lib/features/api/dashboard.api'

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useGetDashboardStatsQuery(undefined)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                Error loading dashboard stats
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: FiPackage,
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockCount,
            icon: FiAlertTriangle,
            color: 'text-warning-600',
            bgColor: 'bg-warning-50',
        },
        {
            title: "Today's Sales",
            value: stats.todaySales,
            icon: FiTrendingUp,
            color: 'text-success-600',
            bgColor: 'bg-success-50',
        },
        {
            title: "Today's Revenue",
            value: formatCurrency(stats.todayRevenue),
            icon: FiDollarSign,
            color: 'text-success-600',
            bgColor: 'bg-success-50',
        },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to your inventory management system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <a
                                href="/products/new"
                                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <p className="font-medium text-gray-900">Add New Product</p>
                                <p className="text-sm text-gray-600">Create a new inventory item</p>
                            </a>
                            <a
                                href="/"
                                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <p className="font-medium text-gray-900">Process Sale</p>
                                <p className="text-sm text-gray-600">Open Point of Sale</p>
                            </a>
                            <a
                                href="/reports"
                                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <p className="font-medium text-gray-900">View Reports</p>
                                <p className="text-sm text-gray-600">Access sales and inventory reports</p>
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Products</span>
                                <span className="font-medium">{stats.totalProducts}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Low Stock Alerts</span>
                                <span className="font-medium text-warning-600">{stats.lowStockCount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Today's Sales</span>
                                <span className="font-medium text-success-600">{stats.todaySales}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Today's Revenue</span>
                                <span className="font-medium text-success-600">
                                    {formatCurrency(stats.todayRevenue)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
