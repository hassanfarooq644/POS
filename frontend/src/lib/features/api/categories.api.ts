import { apiSlice } from './apiSlice'

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/categories',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['Categories'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Categories', id }, 'Categories'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
})

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi
