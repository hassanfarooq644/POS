import { jwtDecode } from 'jwt-decode'
import api from './api'

import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'

export interface JWTPayload {
    userId: string
    email: string
    role: string
    exp: number
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    username: string
    role: string
    picture?: string | null
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
    console.log({ windowInSetAuthToken: window, tokenInSetAuthToken: token })
    if (typeof window === 'undefined') return
    // localStorage.setItem(TOKEN_KEY, token)
    Cookies.set(TOKEN_KEY, token, { expires: 7 }) // 7 days
}

export function clearAuthToken() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    Cookies.remove(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
    const token = getAuthToken()
    if (!token) return false

    try {
        const decoded = jwtDecode<JWTPayload>(token)
        return decoded.exp * 1000 > Date.now()
    } catch (error) {
        return false
    }
}

export function getUser(): JWTPayload | null {
    const token = getAuthToken()
    if (!token) return null

    try {
        return jwtDecode<JWTPayload>(token)
    } catch (error) {
        return null
    }
}

export async function login(credentials: any) {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data
    setAuthToken(token)
    return { token, user }
}

export async function register(data: any) {
    const response = await api.post('/auth/register', data)
    const { token, user } = response.data
    setAuthToken(token)
    return { token, user }
}

export function logout() {
    clearAuthToken()
    window.location.href = '/login'
}
