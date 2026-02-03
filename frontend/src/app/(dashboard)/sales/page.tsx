'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Sale {
    id: string
    totalAmount: number
    saleDate: string
    customer: {
        firstName: string
        lastName: string
    }
    staff: {
        firstName: string
        lastName: string
    }
    saleItems: any[]
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchSales()
    }, [])

    const fetchSales = async () => {
        try {
            const response = await fetch('/api/sales')
            const data = await response.json()
            setSales(data.sales || [])
        } catch (error) {
            console.error('Error fetching sales:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const columns = [
        { key: 'id', label: 'Sale ID', render: (sale: Sale) => sale.id.slice(0, 8) },
        {
            key: 'customer',
            label: 'Customer',
            render: (sale: Sale) => `${sale.customer.firstName} ${sale.customer.lastName}`,
        },
        {
            key: 'staff',
            label: 'Processed By',
            render: (sale: Sale) => `${sale.staff.firstName} ${sale.staff.lastName}`,
        },
        {
            key: 'items',
            label: 'Items',
            render: (sale: Sale) => sale.saleItems.length,
        },
        {
            key: 'totalAmount',
            label: 'Total',
            render: (sale: Sale) => formatCurrency(sale.totalAmount),
        },
        {
            key: 'saleDate',
            label: 'Date',
            render: (sale: Sale) => formatDate(sale.saleDate),
        },
    ]

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
                <p className="text-gray-600 mt-1">View all sales transactions</p>
            </div>

            <DataTable data={sales} columns={columns} keyExtractor={(sale) => sale.id} />
        </div>
    )
}
