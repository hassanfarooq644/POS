import { apiSlice } from './apiSlice'

export const itemTypesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getItemTypes: builder.query({
            query: () => '/itemTypes',
            providesTags: ['ItemTypes'],
        }),
        createItemType: builder.mutation({
            query: (newItemType) => ({
                url: '/itemTypes',
                method: 'POST',
                body: newItemType,
            }),
            invalidatesTags: ['ItemTypes'],
        }),
        updateItemType: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/itemTypes/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'ItemTypes', id }, 'ItemTypes'],
        }),
        deleteItemType: builder.mutation({
            query: (id) => ({
                url: `/itemTypes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ItemTypes'],
        }),
    }),
})

export const {
    useGetItemTypesQuery,
    useCreateItemTypeMutation,
    useUpdateItemTypeMutation,
    useDeleteItemTypeMutation,
} = itemTypesApi
