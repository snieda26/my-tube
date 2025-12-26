/**
 * Next.js 16 Proxy
 * Replaces middleware.ts for route protection and authentication checks
 * 
 * Key changes in Next.js 16:
 * - middleware.ts renamed to proxy.ts
 * - Function renamed from 'middleware' to 'proxy'
 * - Clearer network boundary definition
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Define route types
  const isAuthRoute = pathname.startsWith('/auth')
  const isProtectedRoute = ['/subscriptions'].some((route) =>
    pathname.startsWith(route)
  )

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && accessToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/subscriptions',
    // Add more protected routes here as needed
    // '/studio/:path*',
    // '/liked',
    // '/history',
  ],
}

