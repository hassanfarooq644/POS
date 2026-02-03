'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

interface Product {
    id: string
    itemName: string
    barcode: string
    quantity: number
    retailPrice: number
    category: { name: string }
    itemType: { name: string }
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (search) {
            const filtered = products.filter(
                (p) =>
                    p.itemName.toLowerCase().includes(search.toLowerCase()) ||
                    p.barcode.toLowerCase().includes(search.toLowerCase())
            )
            setFilteredProducts(filtered)
        } else {
            setFilteredProducts(products)
        }
    }, [search, products])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data.products || [])
            setFilteredProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' })
            fetchProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const columns = [
        { key: 'itemName', label: 'Product Name' },
        { key: 'barcode', label: 'Barcode' },
        {
            key: 'category',
            label: 'Category',
            render: (product: Product) => product.category.name,
        },
        {
            key: 'quantity',
            label: 'Stock',
            render: (product: Product) => (
                <span
                    className={product.quantity <= 10 ? 'text-danger-600 font-semibold' : ''}
                >
                    {product.quantity}
                </span>
            ),
        },
        {
            key: 'retailPrice',
            label: 'Price',
            render: (product: Product) => formatCurrency(product.retailPrice),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (product: Product) => (
                <div className="flex gap-2">
                    <Link href={`/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <FiEdit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                    >
                        <FiTrash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    if (isLoading) {
        return <div className="flex justify-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your inventory items</p>
                </div>
                <Link href="/products/new">
                    <Button>
                        <FiPlus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search products by name or barcode..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <DataTable
                data={filteredProducts}
                columns={columns}
                keyExtractor={(product) => product.id}
            />
        </div>
    )
}
