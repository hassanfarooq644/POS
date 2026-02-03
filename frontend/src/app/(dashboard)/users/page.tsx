'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    username: string
    role: string
    isActive: boolean
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users')
            const data = await response.json()
            setUsers(data.users || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (user: User) => `${user.firstName} ${user.lastName}`,
        },
        { key: 'email', label: 'Email' },
        { key: 'username', label: 'Username' },
        {
            key: 'role',
            label: 'Role',
            render: (user: User) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    {user.role}
                </span>
            ),
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (user: User) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                            ? 'bg-success-100 text-success-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {user.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ]

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-1">Manage system users (Admin only)</p>
            </div>

            <DataTable data={users} columns={columns} keyExtractor={(user) => user.id} />
        </div>
    )
}
