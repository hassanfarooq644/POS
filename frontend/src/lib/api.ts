import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { getAuthToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add interceptor to add token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default api
