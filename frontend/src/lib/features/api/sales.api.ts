import { apiSlice } from './apiSlice'

export const salesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSale: builder.mutation({
            query: (saleData) => ({
                url: '/sales',
                method: 'POST',
                body: saleData,
            }),
            invalidatesTags: ['Sales', 'Products'],
        }),
        getSales: builder.query({
            query: (params) => ({
                url: '/sales',
                params,
            }),
            providesTags: ['Sales'],
        }),
        getSale: builder.query({
            query: (id) => `/sales/${id}`,
            providesTags: (result, error, id) => [{ type: 'Sales', id }],
        }),
    }),
})

export const {
    useCreateSaleMutation,
    useGetSalesQuery,
    useGetSaleQuery,
} = salesApi
