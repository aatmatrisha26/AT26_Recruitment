"use client";

import { useState, useEffect } from "react";
import { getMyApplications } from "@/actions/applications";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; glow: string; icon: typeof Clock }> = {
    applied: { label: "APPLIED", color: "#FF9E64", glow: "rgba(255,158,100,0.1)", icon: Clock },
    interview_left: { label: "INTERVIEW LEFT", color: "#00F0FF", glow: "rgba(0,240,255,0.1)", icon: Clock },
    accepted: { label: "ACCEPTED", color: "#4ADE80", glow: "rgba(74,222,128,0.1)", icon: CheckCircle },
    rejected: { label: "REJECTED", color: "#FF4444", glow: "rgba(255,68,68,0.1)", icon: XCircle },
};

const TUTORIAL_STEPS = [
    { title: "Track Application Status", description: "See all your applications and their current status. Check back regularly for updates." },
    { title: "Status Meanings", description: "INTERVIEW LEFT = go give your interview. ACCEPTED/REJECTED = results are published." },
    { title: "Join WhatsApp Groups", description: "Once accepted, you'll see a 'Join Group' button to join that domain's WhatsApp group." }
];

export default function StatusPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => { loadApps(); }, []);

    async function loadApps() {
        const r = await getMyApplications();
        setApps(r.data || []);
        setLoading(false);
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-1 h-8 sm:h-10 rounded-full" style={{ background: 'linear-gradient(180deg, #FF9E64, #FF206E)' }} />
                    <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl text-white tracking-tight">MY STATUS</h1>
                </div>
                <p className="font-inter text-xs sm:text-sm text-white/30 ml-5 pl-2">Track your applications across domains.</p>
                {apps.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 sm:mt-3 ml-5 pl-2 rounded-full neon-border-pink bg-at-pink/5 animate-neon-pulse">
                        <span className="font-retro text-[9px] text-at-pink tracking-widest">{apps.length}/6 APPLIED</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => (
                    <div key={i} className="glass-card rounded-xl p-4 sm:p-5 animate-pulse"><div className="h-4 sm:h-5 w-28 sm:w-32 bg-white/5 rounded mb-2" /><div className="h-3 sm:h-4 w-40 sm:w-48 bg-white/3 rounded" /></div>
                ))}</div>
            ) : apps.length === 0 ? (
                <div className="glass-card rounded-xl p-6 sm:p-8 text-center neon-border-pink" style={{ boxShadow: '0 0 40px rgba(255,32,110,0.05)' }}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-at-pink/10 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-at-pink/60" />
                    </div>
                    <p className="font-inter text-xs sm:text-sm text-white/40 mb-4 sm:mb-5">You haven&apos;t applied to any domains yet.</p>
                    <Link href="/register" className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5">
                        Register Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-2.5">
                        {apps.map((app: any) => {
                            const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
                            const d = app.domain;
                            const StatusIcon = s.icon;
                            return (
                                <div key={app.id} className="glass-card rounded-xl p-3.5" style={{ borderColor: `${s.color}15` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-base">{d?.icon || "📋"}</span>
                                            <h3 className="font-heading text-sm text-white tracking-tight truncate">{d?.name || "Unknown"}</h3>
                                        </div>
                                        <span className="retro-badge text-[8px] inline-flex items-center gap-2 shrink-0"
                                            style={{ background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}20` }}>
                                            <StatusIcon className="w-2.5 h-2.5" />
                                            {s.label}
                                        </span>
                                    </div>
                                    <p className="font-inter text-[10px] text-white/20 ml-7">📍 {d?.venue || "TBD"}</p>
                                    {app.status === "accepted" && d?.whatsapp_link && (
                                        <a href={d.whatsapp_link} target="_blank" rel="noopener noreferrer"
                                            className="btn-retro inline-flex items-center gap-1.5 mt-2.5 ml-7 text-[9px] px-3 py-1.5 bg-at-cyan/10 text-at-cyan rounded-lg neon-border-cyan">
                                            JOIN GROUP <ArrowRight className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block retro-table">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Domain</th>
                                    <th className="text-left">Venue</th>
                                    <th className="text-left">Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app: any) => {
                                    const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
                                    const d = app.domain;
                                    const StatusIcon = s.icon;
                                    return (
                                        <tr key={app.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span>{d?.icon || "📋"}</span>
                                                    <span className="font-inter text-sm text-white font-medium">{d?.name || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td className="font-inter text-xs text-white/30">{d?.venue || "TBD"}</td>
                                            <td>
                                                <span className="retro-badge text-[9px] inline-flex items-center gap-2"
                                                    style={{ background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}20` }}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {app.status === "accepted" && d?.whatsapp_link ? (
                                                    <a href={d.whatsapp_link} target="_blank" rel="noopener noreferrer"
                                                        className="btn-retro inline-flex items-center gap-1.5 text-[9px] px-4 py-1.5 bg-at-cyan/10 text-at-cyan rounded-lg neon-border-cyan">
                                                        JOIN GROUP <ArrowRight className="w-2.5 h-2.5" />
                                                    </a>
                                                ) : <span className="font-inter text-xs text-white/15">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <Tutorial pageKey="status" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
