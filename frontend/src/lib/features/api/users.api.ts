import { apiSlice } from './apiSlice'

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['Auth'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Auth'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
})

export const {
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi
