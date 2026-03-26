import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'timberlake-ultra-secure-key-256-bit-alpha-numeric-terminal-access';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

// Routes that don't require authentication
const publicRoutes = ['/login', '/forgot-password'];

// API routes that don't require authentication
const publicApiRoutes = ['/api/auth/refresh'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Skip assets and internal next.js routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/favicon.ico') ||
        pathname.includes('/images/')
    ) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('accessToken')?.value;

    let isAuthenticated = false;

    if (accessToken) {
        try {
            await jwtVerify(accessToken, ENCODED_SECRET);
            isAuthenticated = true;
        } catch (error) {
            isAuthenticated = false;
        }
    }

    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    const isDashboardRoute = pathname.startsWith('/admin') || pathname === '/';

    // 2. Redirect authenticated users away from public auth routes
    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // 3. Redirect unauthenticated users to login for protected routes
    if (isDashboardRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Protect API routes (except public ones and auth APIs which handle their own logic)
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !publicApiRoutes.some(route => pathname === route)) {
        if (!isAuthenticated) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Authentication required' }),
                { status: 401, headers: { 'content-type': 'application/json' } }
            );
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (api routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|images).*)',
    ],
};
