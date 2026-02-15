'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { getSession, getCODomainSlug } from '@/lib/auth';
import { rateLimit, isValidUUID } from '@/lib/rate-limit';

/**
 * Get applicants for a CO's domain with pagination.
 */
export async function getApplicantsForDomain(page: number = 1, pageSize: number = 50) {
    const user = await getSession();
    if (!user || !user.role.startsWith('CO_')) {
        return { error: 'Unauthorized', data: [], total: 0 };
    }

    const domainSlug = getCODomainSlug(user.role);
    if (!domainSlug) return { error: 'Invalid CO role', data: [], total: 0 };

    const supabase = await createServiceClient();

    // Get domain ID
    const { data: domain } = await supabase
        .from('domains')
        .select('id')
        .eq('slug', domainSlug)
        .single();

    if (!domain) return { error: 'Domain not found', data: [], total: 0 };

    // Paginated query with count
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
        .from('applications')
        .select(`
      id, status, score, interview_done, created_at,
      user:users(id, name, srn, email, phone, year)
    `, { count: 'exact' })
        .eq('domain_id', domain.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Get applicants error:', error);
        return { error: 'Failed to fetch applicants', data: [], total: 0 };
    }

    return { data: data || [], domainId: domain.id, total: count || 0 };
}

/**
 * Get CO's own domain info + applicant stats for the dashboard.
 */
export async function getCODomainInfo() {
    const user = await getSession();
    if (!user || !user.role.startsWith('CO_')) {
        return { error: 'Unauthorized' };
    }

    const domainSlug = getCODomainSlug(user.role);
    if (!domainSlug) return { error: 'Invalid CO role' };

    const supabase = await createServiceClient();

    // Get domain details
    const { data: domain } = await supabase
        .from('domains')
        .select('*')
        .eq('slug', domainSlug)
        .single();

    if (!domain) return { error: 'Domain not found' };

    // Get all applications for stats
    const { data: apps } = await supabase
        .from('applications')
        .select('status, score, interview_done')
        .eq('domain_id', domain.id);

    const allApps = apps || [];
    const stats = {
        total: allApps.length,
        pending: allApps.filter(a => !a.interview_done).length,
        interviewed: allApps.filter(a => a.interview_done).length,
        accepted: allApps.filter(a => a.status === 'accepted').length,
        rejected: allApps.filter(a => a.status === 'rejected').length,
        scored: allApps.filter(a => a.score !== null).length,
        avgScore: allApps.filter(a => a.score !== null).length > 0
            ? allApps.filter(a => a.score !== null).reduce((sum, a) => sum + (a.score || 0), 0) / allApps.filter(a => a.score !== null).length
            : null,
    };

    return { domain, stats };
}

export async function scoreCandidate(applicationId: string, score: number) {
    const user = await getSession();
    if (!user || !user.role.startsWith('CO_')) {
        return { error: 'Unauthorized' };
    }

    // Input validation
    if (!applicationId || !isValidUUID(applicationId)) {
        return { error: 'Invalid application ID' };
    }
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > 10) {
        return { error: 'Score must be an integer between 1 and 10' };
    }

    // Rate limit — 10 score attempts per 60 seconds
    const rateLimitError = rateLimit(user.srn, 'score', 10, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();

    // Parallel: check freeze + verify ownership
    const domainSlug = getCODomainSlug(user.role);
    if (!domainSlug) return { error: 'Invalid CO role' };

    const [settingsResult, appResult] = await Promise.all([
        supabase.from('system_settings').select('frozen').single(),
        supabase.from('applications')
            .select('domain_id, domain:domains(slug)')
            .eq('id', applicationId)
            .single(),
    ]);

    if (settingsResult.data?.frozen) {
        return { error: 'System is frozen' };
    }

    if (!appResult.data || (appResult.data.domain as any)?.slug !== domainSlug) {
        return { error: 'Cannot score applications from other domains' };
    }

    const { error } = await supabase
        .from('applications')
        .update({ score })
        .eq('id', applicationId);

    if (error) return { error: 'Failed to update score' };
    return { success: true };
}

export async function markInterviewDone(applicationId: string, score?: number) {
    const user = await getSession();
    if (!user || !user.role.startsWith('CO_')) {
        return { error: 'Unauthorized' };
    }

    if (!applicationId || !isValidUUID(applicationId)) {
        return { error: 'Invalid application ID' };
    }

    // Validate score if provided
    if (score !== undefined && (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > 10)) {
        return { error: 'Score must be an integer between 1 and 10' };
    }

    // Rate limit — 10 per 60 seconds
    const rateLimitError = rateLimit(user.srn, 'interview_done', 10, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();
    const domainSlug = getCODomainSlug(user.role);

    // Verify ownership
    const { data: app } = await supabase
        .from('applications')
        .select('domain_id, domain:domains(slug)')
        .eq('id', applicationId)
        .single();

    if (!app || (app.domain as any)?.slug !== domainSlug) {
        return { error: 'Unauthorized' };
    }

    // Build update — always mark done + set status to applied; add score if given
    const updateData: { interview_done: boolean; status: string; score?: number } = {
        interview_done: true,
        status: 'applied',
    };
    if (score !== undefined) {
        updateData.score = score;
    }

    const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

    if (error) return { error: 'Failed to update' };
    return { success: true };
}

export async function suggestAcceptReject(applicationId: string, status: 'accepted' | 'rejected') {
    const user = await getSession();
    if (!user || !user.role.startsWith('CO_')) {
        return { error: 'Unauthorized' };
    }

    if (!applicationId || !isValidUUID(applicationId)) {
        return { error: 'Invalid application ID' };
    }

    // Validate status value strictly
    if (status !== 'accepted' && status !== 'rejected') {
        return { error: 'Invalid status' };
    }

    // Rate limit — 10 per 60 seconds
    const rateLimitError = rateLimit(user.srn, 'accept_reject', 10, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();

    // Parallel: freeze check + ownership verification
    const domainSlug = getCODomainSlug(user.role);
    const [settingsResult, appResult] = await Promise.all([
        supabase.from('system_settings').select('frozen').single(),
        supabase.from('applications')
            .select('domain_id, domain:domains(slug)')
            .eq('id', applicationId)
            .single(),
    ]);

    if (settingsResult.data?.frozen) {
        return { error: 'System is frozen — cannot modify' };
    }

    if (!appResult.data || (appResult.data.domain as any)?.slug !== domainSlug) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

    if (error) return { error: 'Failed to update status' };
    return { success: true };
}
