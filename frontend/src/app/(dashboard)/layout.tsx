'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setUser, setLoading } from '@/lib/features/auth/authSlice'
import api from '@/lib/api'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user, isLoading } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me')
                if (!response.data.success) {
                    router.push('/login')
                    return
                }
                dispatch(setUser(response.data.user))
            } catch (error) {
                router.push('/login')
            } finally {
                dispatch(setLoading(false))
            }
        }

        if (!user) {
            fetchUser()
        }
    }, [dispatch, router, user])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {JSON.stringify(user)}
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user && !isLoading) {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    )
}
