import { apiSlice } from './apiSlice'

export const productsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => '/products',
            providesTags: ['Products'],
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }, 'Products'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi
