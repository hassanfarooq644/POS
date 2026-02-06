import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import cartReducer from './features/cart/cartSlice'
import { apiSlice } from './features/api/apiSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            cart: cartReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(apiSlice.middleware),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
