'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { addToCart, updateQuantity, removeFromCart, clearCart } from '@/lib/features/cart/cartSlice'
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'
import { useGetProductsQuery } from '@/lib/features/api/products.api'
import { useGetUsersQuery } from '@/lib/features/api/users.api'
import { useCreateSaleMutation } from '@/lib/features/api/sales.api'

interface Product {
    id: string
    itemName: string
    barcode: string
    quantity: number
    retailPrice: number
    tax: number
    picture?: string
}

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
}

export default function POSPage() {
    const dispatch = useAppDispatch()
    const cartItems = useAppSelector((state) => state.cart.items)

    const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery(undefined)
    const { data: usersData } = useGetUsersQuery(undefined)
    const [createSale, { isLoading: isProcessing }] = useCreateSaleMutation()

    const products: Product[] = productsData?.products || []
    const users: User[] = usersData?.users || []

    const [search, setSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState('')

    const filteredProducts = products.filter(
        (p) =>
            p.itemName.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode.toLowerCase().includes(search.toLowerCase())
    )

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({
            productId: product.id,
            itemName: product.itemName,
            barcode: product.barcode,
            quantity: 1,
            retailPrice: parseFloat(product.retailPrice.toString()),
            tax: parseFloat(product.tax.toString()),
            picture: product.picture,
        }))
    }

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity * item.retailPrice, 0)
    }

    const handleCompleteSale = async () => {
        if (!selectedCustomer) {
            alert('Please select a customer')
            return
        }

        if (cartItems.length === 0) {
            alert('Cart is empty')
            return
        }

        try {
            await createSale({
                customerId: selectedCustomer,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            }).unwrap()

            alert('Sale completed successfully!')
            dispatch(clearCart())
            setSelectedCustomer('')
        } catch (error: any) {
            alert(error.data?.message || error.message || 'Failed to complete sale')
        }
    }

    if (isLoadingProducts) {
        return <div className="flex justify-center py-12">Loading products...</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Point of Sale</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <h3 className="font-medium text-gray-900">{product.itemName}</h3>
                                    <p className="text-sm text-gray-600">{product.barcode}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-semibold text-primary-600">
                                            {formatCurrency(product.retailPrice)}
                                        </span>
                                        <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cart Section */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <FiShoppingCart className="inline mr-2" />
                            Cart ({cartItems.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Customer *
                            </label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                className="w-full h-10 rounded-md border border-gray-300 px-3"
                            >
                                <option value="">Choose a customer</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-sm">{item.itemName}</h4>
                                            <p className="text-xs text-gray-600">{formatCurrency(item.retailPrice)}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => dispatch(removeFromCart(item.productId))}
                                        >
                                            <FiTrash2 className="h-4 w-4 text-danger-600" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}
                                        >
                                            <FiMinus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-12 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                                        >
                                            <FiPlus className="h-3 w-3" />
                                        </Button>
                                        <span className="ml-auto font-semibold">
                                            {formatCurrency(item.quantity * item.retailPrice)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total:</span>
                                <span>{formatCurrency(calculateTotal())}</span>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleCompleteSale}
                                disabled={isProcessing || cartItems.length === 0 || !selectedCustomer}
                            >
                                {isProcessing ? 'Processing...' : 'Complete Sale'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
