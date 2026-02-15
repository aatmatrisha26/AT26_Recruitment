// Database types for AT26 Recruitment System

export type UserRole = 'student' | 'CO_TECH' | 'CO_LOGS' | 'CO_SNI' | 'CO_SPONSORSHIP' | 'CO_PRC' | 'CO_MEDIA' | 'CO_INHOUSE' | 'CO_DISCO' | 'CO_DESIGN' | 'CO_FINANCE' | 'CO_OPS' | 'CO_CUL' | 'CO_HOSPITALITY' | 'CO_FYI' | 'superadmin';

export type ApplicationStatus = 'interview_left' | 'applied' | 'accepted' | 'rejected';

export interface User {
    id: string;
    srn: string;
    name: string;
    email: string;
    phone: string;
    year: number;
    role: UserRole;
    created_at: string;
}

export interface Domain {
    id: string;
    name: string;
    slug: string;
    venue: string;
    description: string;
    what_they_do: string;
    whatsapp_link: string | null;
    icon: string;
}

export interface Application {
    id: string;
    user_id: string;
    domain_id: string;
    status: ApplicationStatus;
    score: number | null;
    interview_done: boolean;
    created_at: string;
}

export interface ApplicationWithDetails extends Application {
    user: User;
    domain: Domain;
}

export interface DomainStats {
    domain_name: string;
    domain_id: string;
    total_applicants: number;
    accepted: number;
    rejected: number;
    pending: number;
}

export interface SystemSettings {
    id: string;
    frozen: boolean;
    results_published: boolean;
    updated_at: string;
}

// Map CO roles to domain slugs
export const CO_DOMAIN_MAP: Record<string, string> = {
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
