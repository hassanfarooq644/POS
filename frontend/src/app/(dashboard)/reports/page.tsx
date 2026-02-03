'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { formatCurrency } from '@/lib/utils'
import { FiAlertTriangle, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    })
    const [salesSummary, setSalesSummary] = useState<any>(null)
    const [topCustomers, setTopCustomers] = useState<any[]>([])
    const [productPerformance, setProductPerformance] = useState<any>(null)
    const [lowStock, setLowStock] = useState<any[]>([])

    useEffect(() => {
        fetchReports()
    }, [dateRange])

    const fetchReports = async () => {
        try {
            const [salesRes, customersRes, performanceRes, lowStockRes] = await Promise.all([
                fetch(`/api/reports/sales-summary?from=${dateRange.from}&to=${dateRange.to}`),
                fetch('/api/reports/top-customers?limit=10'),
                fetch('/api/reports/product-performance'),
                fetch('/api/reports/low-stock'),
            ])

            const salesData = await salesRes.json()
            const customersData = await customersRes.json()
            const performanceData = await performanceRes.json()
            const lowStockData = await lowStockRes.json()

            setSalesSummary(salesData.summary)
            setTopCustomers(customersData.topCustomers)
            setProductPerformance(performanceData)
            setLowStock(lowStockData.lowStockProducts)
        } catch (error) {
            console.error('Error fetching reports:', error)
        }
    }

    const customerColumns = [
        {
            key: 'customer',
            label: 'Customer',
            render: (item: any) => `${item.customer.firstName} ${item.customer.lastName}`,
        },
        { key: 'totalPurchases', label: 'Purchases' },
        {
            key: 'totalAmount',
            label: 'Total Spent',
            render: (item: any) => formatCurrency(item.totalAmount),
        },
    ]

    const lowStockColumns = [
        { key: 'itemName', label: 'Product' },
        { key: 'barcode', label: 'Barcode' },
        {
            key: 'quantity',
            label: 'Stock',
            render: (item: any) => (
                <span className="text-danger-600 font-semibold">{item.quantity}</span>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (item: any) => item.category.name,
        },
    ]

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive sales and inventory analytics</p>
            </div>

            {/* Date Range Selector */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="w-full h-10 rounded-md border border-gray-300 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="w-full h-10 rounded-md border border-gray-300 px-3"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sales Summary */}
            {salesSummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Sales</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {salesSummary.totalSales}
                                    </p>
                                </div>
                                <div className="bg-primary-50 p-3 rounded-lg">
                                    <FiTrendingUp className="h-6 w-6 text-primary-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(salesSummary.totalRevenue)}
                                    </p>
                                </div>
                                <div className="bg-success-50 p-3 rounded-lg">
                                    <FiDollarSign className="h-6 w-6 text-success-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Profit</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(salesSummary.totalProfit)}
                                    </p>
                                </div>
                                <div className="bg-success-50 p-3 rounded-lg">
                                    <FiTrendingUp className="h-6 w-6 text-success-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Customers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={topCustomers}
                            columns={customerColumns}
                            keyExtractor={(item) => item.customer.id}
                            itemsPerPage={5}
                        />
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <FiAlertTriangle className="inline mr-2 text-warning-600" />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={lowStock}
                            columns={lowStockColumns}
                            keyExtractor={(item) => item.id}
                            itemsPerPage={5}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Product Performance */}
            {productPerformance && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <FiTrendingUp className="inline mr-2 text-success-600" />
                                Best Selling Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {productPerformance.bestSelling.map((item: any, index: number) => (
                                    <div key={item.product.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.product.itemName}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.totalSold} units sold
                                            </p>
                                        </div>
                                        <span className="text-success-600 font-semibold">
                                            {formatCurrency(item.revenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <FiTrendingDown className="inline mr-2 text-warning-600" />
                                Slow Moving Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {productPerformance.worstSelling.map((item: any, index: number) => (
                                    <div key={item.product.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.product.itemName}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.totalSold} units sold
                                            </p>
                                        </div>
                                        <span className="text-gray-600">
                                            {formatCurrency(item.revenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
