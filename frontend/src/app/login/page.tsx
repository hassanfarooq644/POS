'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setUser } from '@/lib/features/auth/authSlice'
import { login } from '@/lib/auth'

export default function LoginPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('admin@example.com')
    const [password, setPassword] = useState('admin123')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAppSelector((state) => state.auth)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { user } = await login({ email, password })

            // Store user in Redux
            dispatch(setUser(user))

            // Redirect to dashboard
            router.push('/')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Inventory System</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>
                {JSON.stringify({ user: user })}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/register" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
