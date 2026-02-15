"use client";

import { useState, useEffect, useTransition } from "react";
import { DOMAINS_DATA, DOMAIN_TAGLINES } from "@/lib/domains";
import { applyToDomain, getDomains, getMyApplications } from "@/actions/applications";
import { MapPin, CheckCircle, ArrowRight, X } from "lucide-react";
import Link from "next/link";

const BADGE_COLORS = ['#FF3378', '#F47B58', '#4ECDC4', '#8892b0'];

export default function RegisterPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [myApps, setMyApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [toast, setToast] = useState<{ domain: string; visible: boolean } | null>(null);

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
                // Show interview reminder toast
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
                <div
                    className={`fixed top-6 right-6 z-50 max-w-sm transition-all duration-500 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                    <div className="bg-at-dark border border-at-teal/30 rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-at-teal/20 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-at-teal" />
                            </div>
                            <div className="flex-1">
                                <p className="font-heading text-sm text-white tracking-wider mb-1">REGISTERED!</p>
                                <p className="font-inter text-xs text-white/60 leading-relaxed">
                                    Great! Now go ahead and give your interview for <span className="text-at-teal font-medium">{toast.domain}</span> at the listed venue.
                                </p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-white/30 hover:text-white/60 shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Auto-dismiss progress bar */}
                        <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-at-teal rounded-full" style={{ animation: 'shrink 4s linear forwards' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Header + CTA row */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-10 rounded-full bg-at-teal" />
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-wider">REGISTER</h1>
                    </div>
                    <p className="font-inter text-sm text-white/40 ml-5 pl-2">Pick your domains and register. Max 6.</p>
                    {myApps.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 ml-5 pl-2 rounded-full bg-at-teal/10 border border-at-teal/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-teal" />
                            <span className="font-space text-[11px] text-at-teal tracking-wider">{myApps.length}/6 Applied</span>
                        </div>
                    )}
                </div>
                <Link
                    href="/status"
                    className="inline-flex items-center gap-2 font-heading tracking-wider text-base px-8 py-3 bg-at-orange text-white rounded-xl hover:bg-at-pink transition-all duration-200 shadow-[0_0_20px_rgba(244,123,88,0.2)] hover:shadow-[0_0_30px_rgba(255,51,120,0.3)] shrink-0"
                >
                    Check Status
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg font-space text-sm font-bold ${message.type === "success" ? "bg-at-teal/20 border border-at-teal/30 text-at-teal" : "bg-red-500/20 border border-red-500/30 text-red-400"}`}>{message.text}</div>
            )}

            {loading ? (
                <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"><div className="h-5 w-32 bg-white/10 rounded mb-2" /><div className="h-4 w-48 bg-white/5 rounded" /></div>
                ))}</div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {domains.map((d, i) => (
                            <div key={d.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-heading text-sm text-white shrink-0" style={{ background: BADGE_COLORS[i % BADGE_COLORS.length] }}>
                                            {d.icon || d.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-base text-white tracking-wider">{d.name}</h3>
                                            <p className="font-inter text-[10px] text-white/30">{DOMAIN_TAGLINES[d.slug] || ''}</p>
                                        </div>
                                    </div>
                                    {isApplied(d.id) ? (
                                        <span className="inline-flex items-center gap-1 font-space text-[10px] font-bold text-at-teal bg-at-teal/15 border border-at-teal/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            <CheckCircle className="w-3 h-3" /> Applied
                                        </span>
                                    ) : (
                                        <button onClick={() => handleApply(d.id, d.name)} disabled={isPending || myApps.length >= 6}
                                            className="font-heading text-xs px-4 py-2 bg-at-pink text-white tracking-wider hover:bg-at-orange transition-colors disabled:opacity-40 rounded-lg">
                                            Register
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-11">
                                    <MapPin className="w-3 h-3 text-white/30" />
                                    <span className="font-space text-[11px] text-white/30">{d.venue}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Domain</th>
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Venue</th>
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">What They Do</th>
                                    <th className="text-right px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {domains.map((d, i) => (
                                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-heading text-sm text-white shrink-0" style={{ background: BADGE_COLORS[i % BADGE_COLORS.length] }}>
                                                    {d.icon || d.name.charAt(0)}
                                                </div>
                                                <span className="font-inter text-sm text-white font-medium">{d.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3 h-3 text-white/30" />
                                                <span className="font-space text-xs text-white/40">{d.venue}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-inter text-xs text-white/30">{DOMAIN_TAGLINES[d.slug] || ''}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {isApplied(d.id) ? (
                                                <span className="inline-flex items-center gap-1 font-space text-[10px] font-bold text-at-teal bg-at-teal/15 border border-at-teal/30 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    <CheckCircle className="w-3 h-3" /> Applied
                                                </span>
                                            ) : (
                                                <button onClick={() => handleApply(d.id, d.name)} disabled={isPending || myApps.length >= 6}
                                                    className="font-heading text-xs px-5 py-2 bg-at-pink text-white tracking-wider hover:bg-at-orange transition-colors disabled:opacity-40 rounded-lg">
                                                    Register
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Inline toast keyframe style */}
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}
