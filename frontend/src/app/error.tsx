'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
                <p className="text-gray-600 mb-8">{error.message || 'An unexpected error occurred.'}</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
                {error.digest && (
                    <p className="mt-4 text-xs text-gray-400">Error Digest: {error.digest}</p>
                )}
            </div>
        </div>
    )
}
