import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth-server'

const publicPaths = ['/login', '/register']
const authPaths = ['/login', '/register']

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Allow public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
        // If already logged in, redirect to dashboard
        if (token && (await verifyToken(token))) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // Protect all other routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-role', payload.role)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (authentication endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}
