'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { useGetProductQuery, useUpdateProductMutation } from '@/lib/features/api/products.api'
import { useGetCategoriesQuery } from '@/lib/features/api/categories.api'
import { useGetItemTypesQuery } from '@/lib/features/api/itemTypes.api'
import { getImageUrl } from '@/lib/utils'

interface Category {
    id: string
    name: string
}

interface ItemType {
    id: string
    name: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
    const { id } = params
    const router = useRouter()

    const { data: productData, isLoading: isLoadingProduct } = useGetProductQuery(id)
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery(undefined)
    const { data: itemTypesData, isLoading: isLoadingItemTypes } = useGetItemTypesQuery(undefined)
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

    const categories: Category[] = categoriesData?.categories || []
    const itemTypes: ItemType[] = itemTypesData?.itemTypes || []

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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
        if (productData?.product) {
            const product = productData.product
            setFormData({
                itemName: product.itemName,
                barcode: product.barcode,
                quantity: product.quantity,
                company: product.company || '',
                wholesalePrice: parseFloat(product.wholesalePrice),
                retailPrice: parseFloat(product.retailPrice),
                description: product.description || '',
                shortDescription: product.shortDescription || '',
                tax: parseFloat(product.tax),
                categoryId: product.categoryId,
                itemTypeId: product.itemTypeId,
            })
            if (product.picture) {
                setPreviewUrl(getImageUrl(product.picture))
            }
        }
    }, [productData])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString())
            })
            if (selectedFile) {
                data.append('picture', selectedFile)
            }

            await updateProduct({ id, formData: data }).unwrap()

            router.push('/products')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Failed to update product')
        }
    }

    const isLoading = isLoadingProduct || isLoadingCategories || isLoadingItemTypes

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>

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

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="flex items-start gap-4">
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary-50 file:text-primary-700
                                        hover:file:bg-primary-100"
                                />
                            </div>
                        </div>

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
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Changes'}
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
