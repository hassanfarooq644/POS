'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface Category {
    id: string
    name: string
}

interface ItemType {
    id: string
    name: string
}

export default function NewProductPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [itemTypes, setItemTypes] = useState<ItemType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        itemName: '',
        barcode: '',
        quantity: 0,
        company: '',
        wholesalePrice: 0,
        retailPrice: 0,
        description: '',
        shortDescription: '',
        tax: 0,
        categoryId: '',
        itemTypeId: '',
    })

    useEffect(() => {
        fetchCategories()
        fetchItemTypes()
    }, [])

    const fetchCategories = async () => {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data.categories || [])
    }

    const fetchItemTypes = async () => {
        const res = await fetch('/api/item-types')
        const data = await res.json()
        setItemTypes(data.itemTypes || [])
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    wholesalePrice: parseFloat(formData.wholesalePrice.toString()),
                    retailPrice: parseFloat(formData.retailPrice.toString()),
                    tax: parseFloat(formData.tax.toString()),
                    quantity: parseInt(formData.quantity.toString()),
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create product')
            }

            router.push('/products')
        } catch (error) {
            console.error('Error creating product:', error)
            alert('Failed to create product')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Product Name *"
                                value={formData.itemName}
                                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                required
                            />
                            <Input
                                label="Barcode *"
                                value={formData.barcode}
                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Type *
                                </label>
                                <select
                                    value={formData.itemTypeId}
                                    onChange={(e) => setFormData({ ...formData, itemTypeId: e.target.value })}
                                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {itemTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Wholesale Price *"
                                type="number"
                                step="0.01"
                                value={formData.wholesalePrice}
                                onChange={(e) => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })}
                                required
                            />
                            <Input
                                label="Retail Price *"
                                type="number"
                                step="0.01"
                                value={formData.retailPrice}
                                onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                            <Input
                                label="Tax (%)"
                                type="number"
                                step="0.01"
                                value={formData.tax}
                                onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

                        <Input
                            label="Short Description"
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
