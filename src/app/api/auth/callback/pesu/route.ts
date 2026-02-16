import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';
import { deriveYear } from '@/lib/auth';

const PESU_OAUTH_BASE_URL = 'https://pesu-oauth2.vercel.app';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
        console.error('PESU OAuth error:', error);
        return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
    }

    if (!code || !state) {
        return NextResponse.redirect(new URL('/?error=missing_params', request.url));
    }

    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get('pesu_code_verifier')?.value;
    const storedState = cookieStore.get('pesu_oauth_state')?.value;

    if (!codeVerifier) {
        return NextResponse.redirect(new URL('/?error=session_expired', request.url));
    }

    if (!storedState || state !== storedState) {
        return NextResponse.redirect(new URL('/?error=state_mismatch', request.url));
    }

    // Extract returnUrl from state (delimiter is now | not _)
    let returnUrl = '/domains';
    const pipeIdx = state.indexOf('|');
    if (pipeIdx !== -1) {
        try {
            returnUrl = Buffer.from(state.slice(pipeIdx + 1), 'base64').toString('utf-8');
        } catch {
            // Invalid base64, use default
        }
    }

    try {
        const tokenParams: Record<string, string> = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.PESU_OAUTH_REDIRECT_URI!,
            client_id: process.env.PESU_OAUTH_CLIENT_ID!,
            code_verifier: codeVerifier,
        };

        if (process.env.PESU_OAUTH_CLIENT_SECRET) {
            tokenParams.client_secret = process.env.PESU_OAUTH_CLIENT_SECRET;
        }

        const tokenResponse = await fetch(`${PESU_OAUTH_BASE_URL}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(tokenParams),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Token exchange failed:', tokenResponse.status, errorData);
            return NextResponse.redirect(new URL('/?error=token_failed', request.url));
        }

        const tokenData = await tokenResponse.json();

        const profileResponse = await fetch(`${PESU_OAUTH_BASE_URL}/api/v1/user`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!profileResponse.ok) {
            console.error('Profile fetch failed:', profileResponse.status);
            return NextResponse.redirect(new URL('/?error=profile_failed', request.url));
        }

        const profile = await profileResponse.json();
        const srn = profile.srn || '';
        const name = profile.name || '';
        const email = profile.email || '';
        const phone = profile.phone || '';
        const year = deriveYear(srn);

        const superAdminSRNs = (process.env.SUPERADMIN_SRNS || '').split(',').map(s => s.trim());
        let role = 'student';
        if (superAdminSRNs.includes(srn)) {
            role = 'superadmin';
        }

        const supabase = await createServiceClient();
        const { data: existingUser } = await supabase
            .from('users')
            .select('role')
            .eq('srn', srn)
            .single();

        if (existingUser?.role && existingUser.role !== 'student') {
            role = existingUser.role;
        }

        await supabase
            .from('users')
            .upsert(
                { srn, name, email, phone, year, role },
                { onConflict: 'srn' }
            );

        // Build redirect URL based on role
        const sessionData = { srn, name, email, role };

        let redirectPath = returnUrl;
        if (role === 'superadmin') {
            redirectPath = '/admin/overview';
        } else if (role.startsWith('CO_')) {
            redirectPath = '/co/recruitments';
        }

        // Set all cookies on the redirect response directly
        const response = NextResponse.redirect(new URL(redirectPath, request.url));

        response.cookies.set('at26_session', JSON.stringify(sessionData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 * 7,
            path: '/',
        });

        response.cookies.delete('pesu_code_verifier');
        response.cookies.delete('pesu_oauth_state');

        return response;
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
    }
}