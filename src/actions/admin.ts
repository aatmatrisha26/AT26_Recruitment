'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth';
import { rateLimit, isValidUUID, sanitize } from '@/lib/rate-limit';

export async function getOverviewStats() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createServiceClient();

    // Single parallel batch instead of N+1 loop
    const [studentsResult, appsResult, acceptedResult, domainsResult, allAppsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
        supabase.from('domains').select('id, name'),
        supabase.from('applications').select('domain_id, status'),
    ]);

    const domains = domainsResult.data || [];
    const allApps = allAppsResult.data || [];

    // Aggregate domain stats in memory (no N+1 queries)
    const domainStats = domains.map(domain => {
        const domainApps = allApps.filter(a => a.domain_id === domain.id);
        const accepted = domainApps.filter(a => a.status === 'accepted').length;
        const rejected = domainApps.filter(a => a.status === 'rejected').length;
        return {
            domain_name: domain.name,
            domain_id: domain.id,
            total_applicants: domainApps.length,
            accepted,
            rejected,
            pending: domainApps.length - accepted - rejected,
        };
    });

    return {
        totalStudents: studentsResult.count || 0,
        totalApplications: appsResult.count || 0,
        totalAccepted: acceptedResult.count || 0,
        domainStats,
    };
}

export async function getMultiDomainStudents() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized', data: [] };
    }

    const supabase = await createServiceClient();

    const { data: acceptedApps } = await supabase
        .from('applications')
        .select(`
      user_id,
      user:users(id, name, srn, email),
      domain:domains(name)
    `)
        .eq('status', 'accepted');

    if (!acceptedApps) return { data: [] };

    // Group by user in memory
    const userMap = new Map<string, { user: any; domains: string[] }>();
    for (const app of acceptedApps) {
        const userId = app.user_id;
        if (!userMap.has(userId)) {
            userMap.set(userId, { user: app.user, domains: [] });
        }
        userMap.get(userId)!.domains.push((app.domain as any)?.name || 'Unknown');
    }

    const multiDomain = Array.from(userMap.values()).filter(entry => entry.domains.length > 1);
    return { data: multiDomain };
}

export async function freezeResults() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    // Rate limit admin actions — 3 per 60 seconds
    const rateLimitError = rateLimit(user.srn, 'admin_freeze', 3, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();
    const { error } = await supabase
        .from('system_settings')
        .update({ frozen: true, updated_at: new Date().toISOString() })
        .not('id', 'is', null);

    if (error) return { error: 'Failed to freeze' };
    return { success: true };
}

export async function unfreezeResults() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    const rateLimitError = rateLimit(user.srn, 'admin_unfreeze', 3, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();
    const { error } = await supabase
        .from('system_settings')
        .update({ frozen: false, updated_at: new Date().toISOString() })
        .not('id', 'is', null);

    if (error) return { error: 'Failed to unfreeze' };
    return { success: true };
}

export async function publishResults() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    const rateLimitError = rateLimit(user.srn, 'admin_publish', 3, 60);
    if (rateLimitError) return { error: rateLimitError };

    const supabase = await createServiceClient();
    const { error } = await supabase
        .from('system_settings')
        .update({ results_published: true, frozen: true, updated_at: new Date().toISOString() })
        .not('id', 'is', null);

    if (error) return { error: 'Failed to publish' };
    return { success: true };
}

export async function updateWhatsAppLink(domainId: string, link: string) {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    if (!domainId || !isValidUUID(domainId)) {
        return { error: 'Invalid domain ID' };
    }

    // Sanitize and validate URL
    const cleanLink = sanitize(link, 500);
    if (cleanLink && !cleanLink.startsWith('https://')) {
        return { error: 'WhatsApp link must be an HTTPS URL' };
    }

    const supabase = await createServiceClient();
    const { error } = await supabase
        .from('domains')
        .update({ whatsapp_link: cleanLink || null })
        .eq('id', domainId);

    if (error) return { error: 'Failed to update link' };
    return { success: true };
}

export async function exportCSV() {
    const user = await getSession();
    if (!user || user.role !== 'superadmin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createServiceClient();
    const { data } = await supabase
        .from('applications')
        .select(`
      status, score, interview_done, created_at,
      user:users(name, srn, email, phone, year),
      domain:domains(name)
    `)
        .order('created_at', { ascending: false });

    if (!data) return { csv: '' };

    const headers = 'Name,SRN,Email,Phone,Year,Domain,Status,Score,Interview Done\n';
    const rows = data.map(app => {
        const u = app.user as any;
        const d = app.domain as any;
        return `"${u?.name || ''}","${u?.srn || ''}","${u?.email || ''}","${u?.phone || ''}",${u?.year || ''},"${d?.name || ''}","${app.status}",${app.score || ''},${app.interview_done}`;
    }).join('\n');

    return { csv: headers + rows };
}
