import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple IP-based rate limiter for middleware (edge runtime compatible)
const ipRequests = new Map<string, { count: number; firstRequest: number }>();
const AUTH_RATE_LIMIT = 20;       // max attempts
const AUTH_RATE_WINDOW = 60_000;  // 60 seconds

function checkAuthRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = ipRequests.get(ip);

    if (!entry || now - entry.firstRequest > AUTH_RATE_WINDOW) {
        ipRequests.set(ip, { count: 1, firstRequest: now });
        return true; // allowed
    }

    if (entry.count >= AUTH_RATE_LIMIT) {
        return false; // blocked
    }

    entry.count++;
    return true;
}

// Cleanup every 5 minutes (only runs when middleware is called)
let lastCleanup = Date.now();
function cleanupIpStore() {
    const now = Date.now();
    if (now - lastCleanup < 300_000) return;
    lastCleanup = now;
    for (const [key, entry] of ipRequests.entries()) {
        if (now - entry.firstRequest > AUTH_RATE_WINDOW) {
            ipRequests.delete(key);
        }
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('at26_session');

    cleanupIpStore();

    // Rate limit auth routes
    if (pathname.startsWith('/api/auth')) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

        if (!checkAuthRateLimit(ip)) {
            return new NextResponse('Too many requests. Please wait before trying again.', {
                status: 429,
                headers: { 'Retry-After': '60' },
            });
        }
        return NextResponse.next();
    }

    // Public routes - no auth needed
    const publicRoutes = ['/', '/domains'];
    if (publicRoutes.some(route => pathname === route)) {
        return addSecurityHeaders(NextResponse.next());
    }

    // If no session, redirect to login with return URL
    if (!sessionCookie?.value) {
        const loginUrl = new URL('/api/auth/pesu', request.url);
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const session = JSON.parse(sessionCookie.value);

        // CO users on student routes → redirect to CO panel
        const studentRoutes = ['/domains', '/register', '/status'];
        if (session.role?.startsWith('CO_') && studentRoutes.some(r => pathname === r)) {
            return NextResponse.redirect(new URL('/co', request.url));
        }

        // CO routes - only CO roles
        if (pathname.startsWith('/co')) {
            if (!session.role?.startsWith('CO_')) {
                return NextResponse.redirect(new URL('/domains', request.url));
            }
        }

        // Admin routes - only superadmin
        if (pathname.startsWith('/admin')) {
            if (session.role !== 'superadmin') {
                return NextResponse.redirect(new URL('/domains', request.url));
            }
        }
    } catch {
        // Invalid cookie — clear and redirect
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('at26_session');
        return response;
    }

    return addSecurityHeaders(NextResponse.next());
}

function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|api/auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
