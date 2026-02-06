import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Auth', 'Products', 'Categories', 'Sales', 'Dashboard', 'ItemTypes'],
    endpoints: (builder) => ({}),
})
