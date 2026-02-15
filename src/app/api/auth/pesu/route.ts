import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PESU_OAUTH_BASE_URL = 'https://pesu-oauth2.vercel.app';

/**
 * Generates a cryptographically secure random string for PKCE
 */
function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values)
        .map(x => possible[x % possible.length])
        .join('');
}

/**
 * Generates SHA-256 hash and returns as Base64URL encoded string
 */
async function sha256Base64URL(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

export async function GET(request: NextRequest) {
    try {
        const clientId = process.env.PESU_OAUTH_CLIENT_ID;
        const redirectUri = process.env.PESU_OAUTH_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
        }

        // Generate PKCE codes
        const codeVerifier = generateRandomString(128);
        const codeChallenge = await sha256Base64URL(codeVerifier);

        // Generate state for CSRF protection
        const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/domains';
        const state = `${generateRandomString(32)}_${Buffer.from(returnUrl).toString('base64')}`;

        // Store verifier + state in httpOnly cookies
        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 600, // 10 minutes
            path: '/',
        };
        cookieStore.set('pesu_code_verifier', codeVerifier, cookieOptions);
        cookieStore.set('pesu_oauth_state', state, cookieOptions);

        // Build authorization URL
        const authUrl = new URL(`${PESU_OAUTH_BASE_URL}/oauth2/authorize`);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'profile:basic profile:academic profile:contact');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        return NextResponse.redirect(authUrl.toString());
    } catch (error) {
        console.error('PESU OAuth init error:', error);
        return NextResponse.redirect(new URL('/?error=oauth_init_failed', request.url));
    }
}
