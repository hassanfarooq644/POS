'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiBarChart2,
    FiLayers,
    FiTag,
    FiUsers,
} from 'react-icons/fi'
import { useAppSelector } from '@/lib/hooks'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Products', href: '/products', icon: FiPackage, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'POS', href: '/', icon: FiShoppingCart, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Sales', href: '/sales', icon: FiShoppingCart, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Categories', href: '/categories', icon: FiLayers, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Item Types', href: '/item-types', icon: FiTag, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Reports', href: '/reports', icon: FiBarChart2, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Users', href: '/users', icon: FiUsers, roles: ['ADMIN'] },
]

export default function Sidebar() {
    const pathname = usePathname()
    const user = useAppSelector((state) => state.auth.user)

    const filteredNavItems = navItems.filter((item) =>
        user ? item.roles.includes(user.role) : false
    )

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-1">
                {filteredNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
