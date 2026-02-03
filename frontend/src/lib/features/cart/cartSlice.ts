import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
    productId: string
    itemName: string
    barcode: string
    quantity: number
    retailPrice: number
    tax: number
    picture?: string
}

interface CartState {
    items: CartItem[]
    customerId: string | null
}

const initialState: CartState = {
    items: [],
    customerId: null,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.productId === action.payload.productId)

            if (existingItem) {
                existingItem.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
        },
        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find(item => item.productId === action.payload.productId)

            if (item) {
                item.quantity = action.payload.quantity
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.productId !== action.payload)
        },
        setCustomer: (state, action: PayloadAction<string>) => {
            state.customerId = action.payload
        },
        clearCart: (state) => {
            state.items = []
            state.customerId = null
        },
    },
})

export const { addToCart, updateQuantity, removeFromCart, setCustomer, clearCart } = cartSlice.actions
export default cartSlice.reducer
