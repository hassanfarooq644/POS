'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from './Button'

interface Column<T> {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyExtractor: (item: T) => string
    itemsPerPage?: number
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    itemsPerPage = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = data.slice(startIndex, endIndex)

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {column.render
                                                ? column.render(item)
                                                : (item as any)[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
                        {data.length} results
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FiChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <FiChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
