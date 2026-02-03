import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StoreProvider from '@/lib/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Inventory Management System',
    description: 'Full-stack inventory management with advanced reporting and auditing',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    )
}
