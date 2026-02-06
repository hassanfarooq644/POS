'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setUser, setLoading } from '@/lib/features/auth/authSlice'
import { useGetMeQuery } from '@/lib/features/api/auth.api'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user, isLoading: authSliceLoading } = useAppSelector((state) => state.auth)

    const { data: meData, isLoading: isQueryLoading, isError } = useGetMeQuery(undefined, {
        skip: !!user, // Skip if we already have a user in the slice
    })

    useEffect(() => {
        if (meData) {
            if (meData.user) {
                dispatch(setUser(meData.user))
            } else {
                router.push('/login')
            }
            dispatch(setLoading(false))
        } else if (isError) {
            router.push('/login')
            dispatch(setLoading(false))
        }
    }, [meData, isError, dispatch, router])

    const isLoading = authSliceLoading || (isQueryLoading && !user)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user && !isLoading) {
        // This case should be handled by the useEffect above, but as a secondary guard
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
