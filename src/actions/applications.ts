'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth';
import { rateLimit, isValidUUID } from '@/lib/rate-limit';

export async function applyToDomain(domainId: string) {
    // 1. Auth check
    const user = await getSession();
    if (!user) return { error: 'Not authenticated' };

    // 2. Input validation
    if (!domainId || !isValidUUID(domainId)) {
        return { error: 'Invalid domain' };
    }

    // 3. Rate limit — 5 apply attempts per 60 seconds per user
    const rateLimitError = rateLimit(user.srn, 'apply', 5, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();

    // 4. Parallel checks: count + freeze status (skip duplicate — DB UNIQUE handles it)
    const [countResult, settingsResult] = await Promise.all([
        supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
        supabase
            .from('system_settings')
            .select('frozen')
            .single(),
    ]);

    // Check max 6
    if (countResult.count !== null && countResult.count >= 6) {
        return { error: 'Maximum 6 domain applications allowed' };
    }

    // Check freeze
    if (settingsResult.data?.frozen) {
        return { error: 'Applications are frozen' };
    }

    // 5. Verify domain exists
    const { data: domain } = await supabase
        .from('domains')
        .select('id')
        .eq('id', domainId)
        .single();

    if (!domain) return { error: 'Domain not found' };

    // 6. Insert — DB UNIQUE(user_id, domain_id) constraint is the final guard
    const { error } = await supabase
        .from('applications')
        .insert({
            user_id: user.id,
            domain_id: domainId,
            status: 'interview_left',
        });

    if (error) {
        // Unique constraint violation = already applied
        if (error.code === '23505') {
            return { error: 'Already applied to this domain' };
        }
        console.error('Apply error:', error);
        return { error: 'Failed to apply' };
    }

    return { success: true };
}

export async function getMyApplications() {
    const user = await getSession();
    if (!user) return { error: 'Not authenticated', data: [] };

    const supabase = await createClient();

    // Parallel fetch: applications + system settings
    const [appsResult, settingsResult] = await Promise.all([
        supabase
            .from('applications')
            .select(`
        id, status, score, interview_done, created_at, domain_id,
        domain:domains(name, slug, venue, icon, whatsapp_link)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('system_settings')
            .select('results_published')
            .single(),
    ]);

    if (appsResult.error) {
        console.error('Get applications error:', appsResult.error);
        return { error: 'Failed to fetch applications', data: [] };
    }

    const apps = appsResult.data || [];
    const resultsPublished = settingsResult.data?.results_published ?? false;

    // Mask status if results are not published
    const maskedApps = apps.map(app => {
        // If results are NOT published and status is decision-made (accepted/rejected),
        // revert it to 'applied' (which implies "Interview Done / Under Review" to the student)
        if (!resultsPublished && (app.status === 'accepted' || app.status === 'rejected')) {
            return { ...app, status: 'applied' };
        }
        return app;
    });

    return { data: maskedApps };
}

export async function getDomains() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('domains')
        .select('id, name, slug, venue, description, icon')
        .order('name');

    if (error) {
        console.error('Get domains error:', error);
        return [];
    }

    return data || [];
}

export async function getSystemSettings() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('system_settings')
        .select('frozen, results_published')
        .single();

    return data;
}

export async function withdrawApplication(domainId: string) {
    const user = await getSession();
    if (!user) return { error: 'Not authenticated' };

    if (!domainId || !isValidUUID(domainId)) {
        return { error: 'Invalid domain' };
    }

    const supabase = await createServiceClient();

    // Check freeze status
    const { data: settings } = await supabase
        .from('system_settings')
        .select('frozen')
        .single();

    if (settings?.frozen) {
        return { error: 'Applications are frozen. Cannot withdraw.' };
    }

    // Delete application
    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('user_id', user.id)
        .eq('domain_id', domainId);

    if (error) {
        console.error('Withdraw error:', error);
        return { error: 'Failed to withdraw application' };
    }

    return { success: true };
}
