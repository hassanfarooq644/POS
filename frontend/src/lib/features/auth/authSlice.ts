import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    picture?: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
            state.isLoading = false
        },
        clearUser: (state) => {
            state.user = null
            state.isLoading = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer
