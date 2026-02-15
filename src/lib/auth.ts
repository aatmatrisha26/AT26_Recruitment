import { cookies } from 'next/headers';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { User, UserRole, CO_DOMAIN_MAP } from '@/lib/supabase/types';

export function deriveYear(srn: string): number {
    // SRN format: PES1UG25CSXXX or PES2UG24ECXXX etc
    const match = srn.match(/UG(\d{2})/i);
    if (!match) return 1;
    const admissionYear = parseInt(match[1], 10);
    const currentYear = 26;
    const yearOfStudy = currentYear - admissionYear;
    if (yearOfStudy <= 0) return 1;
    if (yearOfStudy > 4) return 4;
    return yearOfStudy;
}

/**
 * Get session from cookie. Looks up user in Supabase by SRN.
 * If user doesn't exist in DB yet (e.g. logged in before DB was set up),
 * auto-creates the user record from cookie data.
 */
export async function getSession(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('at26_session');
        if (!sessionCookie?.value) return null;

        const sessionData = JSON.parse(sessionCookie.value);
        if (!sessionData?.srn) return null;

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return null; // Can't work without Supabase
        }

        const supabase = await createClient();
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('srn', sessionData.srn)
            .single();

        if (!error && user) return user as User;

        // User not in DB yet — auto-create from cookie data
        try {
            const serviceClient = await createServiceClient();
            const { data: newUser, error: insertError } = await serviceClient
                .from('users')
                .upsert({
                    srn: sessionData.srn,
                    name: sessionData.name || '',
                    email: sessionData.email || '',
                    phone: '',
                    year: deriveYear(sessionData.srn),
                    role: sessionData.role || 'student',
                }, { onConflict: 'srn' })
                .select('*')
                .single();

            if (!insertError && newUser) return newUser as User;
        } catch (e) {
            console.error('Auto-create user failed:', e);
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Get session data directly from cookie (no Supabase needed).
 * Use this for lightweight checks like showing profile in nav.
 */
export async function getSessionFromCookie() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('at26_session');
        if (!sessionCookie?.value) return null;
        return JSON.parse(sessionCookie.value) as { srn: string; name: string; email: string; role: string };
    } catch {
        return null;
    }
}

export function isCO(role: UserRole): boolean {
    return role.startsWith('CO_');
}

export function isSuperAdmin(role: UserRole): boolean {
    return role === 'superadmin';
}

export function getCODomainSlug(role: UserRole): string | null {
    const map: Record<string, string> = {
        CO_TECH: 'tech',
        CO_LOGS: 'logistics',
        CO_SNI: 'sni',
        CO_SPONSORSHIP: 'sponsorship',
        CO_PRC: 'prc',
        CO_MEDIA: 'media',
        CO_INHOUSE: 'inhouse',
        CO_DISCO: 'disco',
        CO_DESIGN: 'design',
        CO_FINANCE: 'finance',
        CO_OPS: 'operations',
        CO_CUL: 'cultural',
        CO_HOSPITALITY: 'hospitality',
        CO_FYI: 'fyi',
    };
    return map[role] || null;
}
