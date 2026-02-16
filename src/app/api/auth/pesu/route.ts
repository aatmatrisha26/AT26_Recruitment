
import { NextRequest, NextResponse } from 'next/server';

const PESU_OAUTH_BASE_URL = 'https://pesu-oauth2.vercel.app';

function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.~';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values).map(x => possible[x % possible.length]).join('');
}

async function sha256Base64URL(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-').replace(/\
}

function getBaseUrl(request: NextRequest): string {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    try {
        const clientId = process.env.PESU_OAUTH_CLIENT_ID;
        const redirectUri = process.env.PESU_OAUTH_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
        }

        const codeVerifier = generateRandomString(128);
        const codeChallenge = await sha256Base64URL(codeVerifier);

        const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/domains';
        const state = `${generateRandomString(32)}|${Buffer.from(returnUrl).toString('base64')}`;

        const authUrl = new URL(`${PESU_OAUTH_BASE_URL}/oauth2/authorize`);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'profile:basic profile:academic profile:contact');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        const response = NextResponse.redirect(authUrl.toString());
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'lax' as const,
            maxAge: 600,
            path: '/',
        };
        response.cookies.set('pesu_code_verifier', codeVerifier, cookieOptions);
        response.cookies.set('pesu_oauth_state', state, cookieOptions);
        return response;
    } catch (error) {
        console.error('PESU OAuth init error:', error);
        return NextResponse.redirect(new URL('/?error=oauth_init_failed', baseUrl));
    }
}
