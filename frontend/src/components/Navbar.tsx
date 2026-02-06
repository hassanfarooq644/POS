'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { clearUser } from '@/lib/features/auth/authSlice'
import { FiUser, FiLogOut } from 'react-icons/fi'
import { Button } from './ui/Button'
import { useLogoutMutation } from '@/lib/features/api/auth.api'
import Cookies from 'js-cookie'

export default function Navbar() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user)
    const [logout] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout(undefined).unwrap()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            dispatch(clearUser())
            localStorage.removeItem('token')
            Cookies.remove('token')
            router.push('/login')
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary-600">
                            Inventory System
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <FiUser className="h-4 w-4 text-primary-600" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <FiLogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
