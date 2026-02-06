'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { useGetProductsQuery, useDeleteProductMutation } from '@/lib/features/api/products.api'
import placeholderImage from '@/assets/images/300x300.png'

interface Product {
    id: string
    itemName: string
    picture: string
    barcode: string
    quantity: number
    retailPrice: number
    category: { name: string }
}

export default function ProductsPage() {
    const { data, isLoading, isError } = useGetProductsQuery(undefined)
    const [deleteProduct] = useDeleteProductMutation()
    const [search, setSearch] = useState('')

    const products = data?.products || []

    const filteredProducts = products.filter(
        (p: Product) =>
            p.itemName.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await deleteProduct(id).unwrap()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const columns = [
        { key: 'picture', label: 'Picture', render: (product: Product) => (
            <Image 
                src={getImageUrl(product.picture) || placeholderImage} 
                alt={product.itemName} 
                height={100} 
                width={100} 
                className="w-12 h-12 rounded-md object-cover border border-gray-200" 
            /> 
        )},
        { key: 'itemName', label: 'Product Name' },
        { key: 'barcode', label: 'Barcode' },
        {
            key: 'category',
            label: 'Category',
            render: (product: Product) => product.category?.name || 'N/A',
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

    if (isError) {
        return (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                Error loading products. Please try again later.
            </div>
        )
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
