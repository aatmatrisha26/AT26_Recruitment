import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';
import { deriveYear } from '@/lib/auth';

const PESU_OAUTH_BASE_URL = 'https://pesu-oauth2.vercel.app';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    // Handle OAuth errors
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

    // Validate state (CSRF protection)
    if (!storedState || state !== storedState) {
        return NextResponse.redirect(new URL('/?error=state_mismatch', request.url));
    }

    // Extract returnUrl from state
    let returnUrl = '/domains';
    const stateParts = state.split('_');
    if (stateParts.length > 1) {
        try {
            returnUrl = Buffer.from(stateParts[stateParts.length - 1], 'base64').toString('utf-8');
        } catch {
            // Invalid base64, use default
        }
    }

    try {
        // Exchange code for token
        const tokenParams: Record<string, string> = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.PESU_OAUTH_REDIRECT_URI!,
            client_id: process.env.PESU_OAUTH_CLIENT_ID!,
            code_verifier: codeVerifier,
        };

        // Include client_secret for confidential client
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

        // Fetch user profile
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

        // Check if SuperAdmin
        const superAdminSRNs = (process.env.SUPERADMIN_SRNS || '').split(',').map(s => s.trim());
        let role = 'student';
        if (superAdminSRNs.includes(srn)) {
            role = 'superadmin';
        }

        // Upsert user in database
        const supabase = await createServiceClient();
        const { data: existingUser } = await supabase
            .from('users')
            .select('role')
            .eq('srn', srn)
            .single();

        // Preserve CO/admin roles if already set
        if (existingUser?.role && existingUser.role !== 'student') {
            role = existingUser.role;
        }

        await supabase
            .from('users')
            .upsert(
                { srn, name, email, phone, year, role },
                { onConflict: 'srn' }
            );

        // Set session cookie (not httpOnly so client can read profile info)
        const sessionData = { srn, name, email, role };
        cookieStore.set('at26_session', JSON.stringify(sessionData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 * 7, // 7 days
            path: '/',
        });

        // Clean up OAuth cookies
        cookieStore.delete('pesu_code_verifier');
        cookieStore.delete('pesu_oauth_state');

        // Redirect based on role
        if (role === 'superadmin') {
            return NextResponse.redirect(new URL('/admin/overview', request.url));
        } else if (role.startsWith('CO_')) {
            return NextResponse.redirect(new URL('/co/recruitments', request.url));
        }

        return NextResponse.redirect(new URL(returnUrl, request.url));
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
    }
}
