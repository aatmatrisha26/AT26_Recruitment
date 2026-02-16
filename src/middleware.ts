
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRequests = new Map<string, { count: number; firstRequest: number }>();
const AUTH_RATE_LIMIT = 20;
const AUTH_RATE_WINDOW = 60_000;

function checkAuthRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = ipRequests.get(ip);
    if (!entry || now - entry.firstRequest > AUTH_RATE_WINDOW) {
        ipRequests.set(ip, { count: 1, firstRequest: now });
        return true;
    }
    if (entry.count >= AUTH_RATE_LIMIT) return false;
    entry.count++;
    return true;
}

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

function getBaseUrl(request: NextRequest): string {
    const host = request.headers.get('x-forwarded-host')
        || request.headers.get('host')
        || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('at26_session');
    const baseUrl = getBaseUrl(request);

    cleanupIpStore();

    if (pathname.startsWith('/api/auth')) {
        if (!pathname.includes('/callback')) {
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                || request.headers.get('x-real-ip')
                || 'unknown';
            if (!checkAuthRateLimit(ip)) {
                return new NextResponse('Too many requests.', {
                    status: 429,
                    headers: { 'Retry-After': '60' },
                });
            }
        }
        return NextResponse.next();
    }

    if (request.method === 'POST' && request.headers.get('next-action')) {
        return addSecurityHeaders(NextResponse.next());
    }

    const isRSCOrPrefetch =
        request.headers.get('rsc') === '1' ||
        request.headers.get('next-router-prefetch') === '1' ||
        request.headers.get('purpose') === 'prefetch' ||
        request.headers.get('next-url') !== null;

    const publicRoutes = ['/', '/domains'];
    if (publicRoutes.some(route => pathname === route)) {
        return addSecurityHeaders(NextResponse.next());
    }

    if (!sessionCookie?.value) {

        if (isRSCOrPrefetch) {

            return new NextResponse(null, { status: 200 });
        }

        const loginUrl = new URL('/api/auth/pesu', baseUrl);
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const session = JSON.parse(sessionCookie.value);

        const studentOnlyRoutes = ['/register', '/status'];
        if (session.role?.startsWith('CO_') && studentOnlyRoutes.some(r => pathname === r)) {
            if (isRSCOrPrefetch) return addSecurityHeaders(NextResponse.next());
            return NextResponse.redirect(new URL('/co', baseUrl));
        }

        if (pathname.startsWith('/co')) {
            if (!session.role?.startsWith('CO_')) {
                if (isRSCOrPrefetch) return addSecurityHeaders(NextResponse.next());
                return NextResponse.redirect(new URL('/domains', baseUrl));
            }
        }

        if (pathname.startsWith('/admin')) {
            if (session.role !== 'superadmin') {
                if (isRSCOrPrefetch) return addSecurityHeaders(NextResponse.next());
                return NextResponse.redirect(new URL('/domains', baseUrl));
            }
        }
    } catch {
        const response = NextResponse.redirect(new URL('/', baseUrl));
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
    matcher: [
        '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
