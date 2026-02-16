
import { NextResponse, NextRequest } from 'next/server';

function getBaseUrl(request: NextRequest): string {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    const response = NextResponse.redirect(new URL('/', baseUrl));
    response.cookies.delete('at26_session');
    return response;
}
