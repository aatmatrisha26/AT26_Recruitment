"use client";

import { useState, useEffect, useTransition } from "react";
import { DOMAINS_DATA, DOMAIN_TAGLINES } from "@/lib/domains";
import { applyToDomain, getDomains, getMyApplications } from "@/actions/applications";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";
import { MapPin, CheckCircle, ArrowRight, X } from "lucide-react";
import Link from "next/link";

const NEON_COLORS = ['#FF206E', '#00F0FF', '#B026FF', '#FF9E64', '#4ADE80', '#FF206E', '#00F0FF'];

const TUTORIAL_STEPS = [
    { title: "Register for Domains", description: "Click 'Register' next to any domain to apply. You can apply to a maximum of 6 domains." },
    { title: "Interview at Venue", description: "After registering, head to the listed venue for that domain to give your interview." },
    { title: "Track Your Progress", description: "Once applied, click 'Check Status' to see your application status across all domains." }
];

export default function RegisterPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [myApps, setMyApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [toast, setToast] = useState<{ domain: string; visible: boolean } | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        try {
            const [d, a] = await Promise.all([getDomains(), getMyApplications()]);
            setDomains(d.length > 0 ? d : DOMAINS_DATA.map((x, i) => ({ id: `local-${i}`, ...x })));
            setMyApps(a.data || []);
        } catch { setDomains(DOMAINS_DATA.map((x, i) => ({ id: `local-${i}`, ...x }))); }
        finally { setLoading(false); }
    }

    function handleApply(domainId: string, domainName: string) {
        startTransition(async () => {
            const r = await applyToDomain(domainId);
            if (r.error) {
                setMessage({ text: r.error, type: "error" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setToast({ domain: domainName, visible: true });
                setTimeout(() => setToast(prev => prev ? { ...prev, visible: false } : null), 4000);
                setTimeout(() => setToast(null), 4500);
                loadData();
            }
        });
    }

    const isApplied = (id: string) => myApps.some((a: any) => a.domain_id === id);

    return (
        <div>
            {/* Interview Reminder Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm transition-all duration-500 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="glass-card rounded-xl p-3 sm:p-4 neon-border-cyan" style={{ boxShadow: '0 0 30px rgba(0,240,255,0.1)' }}>
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-at-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-at-cyan" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-retro text-[9px] sm:text-[10px] text-at-cyan tracking-widest mb-1">REGISTERED!</p>
                                <p className="font-inter text-[10px] sm:text-xs text-white/50 leading-relaxed">
                                    Go give your interview for <span className="text-at-cyan font-medium">{toast.domain}</span> at the listed venue.
                                </p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-white/20 hover:text-white/50 shrink-0">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="mt-2 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00F0FF, #B026FF)', animation: 'shrink 4s linear forwards' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Header + CTA */}
            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-1 h-8 sm:h-10 rounded-full" style={{ background: 'linear-gradient(180deg, #00F0FF, #B026FF)' }} />
                        <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl text-white tracking-tight">REGISTER</h1>
                    </div>
                    <p className="font-inter text-xs sm:text-sm text-white/30 ml-5 pl-2">Pick your domains and register. Max 6.</p>
                    {myApps.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 sm:mt-3 ml-5 pl-2 rounded-full neon-border-cyan bg-at-cyan/5 animate-neon-pulse-cyan">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-cyan" />
                            <span className="font-retro text-[9px] text-at-cyan tracking-widest">{myApps.length}/6 APPLIED</span>
                        </div>
                    )}
                </div>
                <Link
                    href="/status"
                    className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-xs sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3 shrink-0 w-full sm:w-auto justify-center"
                >
                    Check Status
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
            </div>

            {message && (
                <div className={`mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-retro text-[10px] sm:text-xs tracking-wider ${message.type === "success" ? "bg-at-cyan/10 neon-border-cyan text-at-cyan" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>{message.text}</div>
            )}

            {loading ? (
                <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="glass-card rounded-xl p-4 sm:p-5 animate-pulse"><div className="h-4 sm:h-5 w-28 sm:w-32 bg-white/5 rounded mb-2" /><div className="h-3 sm:h-4 w-40 sm:w-48 bg-white/3 rounded" /></div>
                ))}</div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-2.5">
                        {domains.map((d, i) => {
                            const neonColor = NEON_COLORS[i % NEON_COLORS.length];
                            return (
                                <div key={d.id} className="glass-card rounded-xl p-3.5" style={{ borderColor: `${neonColor}10` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-retro text-[10px] text-white shrink-0" style={{ background: `${neonColor}15`, border: `1px solid ${neonColor}20` }}>
                                                {d.icon || d.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-heading text-sm text-white tracking-tight truncate">{d.name}</h3>
                                                <p className="font-inter text-[9px] text-white/20 truncate">{DOMAIN_TAGLINES[d.slug] || ''}</p>
                                            </div>
                                        </div>
                                        {isApplied(d.id) ? (
                                            <span className="retro-badge text-[8px] bg-at-cyan/10 text-at-cyan border border-at-cyan/20 inline-flex items-center gap-1">
                                                <CheckCircle className="w-2.5 h-2.5" /> APPLIED
                                            </span>
                                        ) : (
                                            <button onClick={() => handleApply(d.id, d.name)} disabled={isPending || myApps.length >= 6}
                                                className="btn-retro text-[9px] px-3 py-1.5 bg-at-pink/10 text-at-pink rounded-lg disabled:opacity-30">
                                                REGISTER
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 ml-9.5">
                                        <MapPin className="w-2.5 h-2.5 text-white/20" />
                                        <span className="font-inter text-[10px] text-white/20">{d.venue}</span>
                                    </div>
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
                                    <th className="text-left">What They Do</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {domains.map((d, i) => {
                                    const neonColor = NEON_COLORS[i % NEON_COLORS.length];
                                    return (
                                        <tr key={d.id}>
                                            <td>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-retro text-xs text-white shrink-0" style={{ background: `${neonColor}12`, border: `1px solid ${neonColor}15` }}>
                                                        {d.icon || d.name.charAt(0)}
                                                    </div>
                                                    <span className="font-inter text-sm text-white font-medium">{d.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3 h-3 text-white/20" />
                                                    <span className="font-inter text-xs text-white/30">{d.venue}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="font-inter text-xs text-white/25">{DOMAIN_TAGLINES[d.slug] || ''}</p>
                                            </td>
                                            <td className="text-right">
                                                {isApplied(d.id) ? (
                                                    <span className="retro-badge text-[9px] bg-at-cyan/10 text-at-cyan border border-at-cyan/20 inline-flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> APPLIED
                                                    </span>
                                                ) : (
                                                    <button onClick={() => handleApply(d.id, d.name)} disabled={isPending || myApps.length >= 6}
                                                        className="btn-retro text-[9px] px-4 py-1.5 bg-at-pink/10 text-at-pink rounded-lg disabled:opacity-30">
                                                        REGISTER
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes shrink { from { width: 100%; } to { width: 0%; } }
            `}</style>

            <Tutorial pageKey="register" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
