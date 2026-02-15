"use client";

import { useState, useEffect } from "react";
import { getMyApplications } from "@/actions/applications";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
    applied: { label: "APPLIED", color: "text-at-orange", bg: "bg-at-orange/15", border: "border-at-orange/30" },
    interview_left: { label: "INTERVIEW LEFT", color: "text-at-teal", bg: "bg-at-teal/15", border: "border-at-teal/30" },
    accepted: { label: "ACCEPTED", color: "text-green-400", bg: "bg-green-400/15", border: "border-green-400/30" },
    rejected: { label: "REJECTED", color: "text-red-400", bg: "bg-red-400/15", border: "border-red-400/30" },
};

export default function StatusPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadApps(); }, []);

    async function loadApps() {
        const r = await getMyApplications();
        setApps(r.data || []);
        setLoading(false);
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-10 rounded-full bg-at-orange" />
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-wider">MY STATUS</h1>
                </div>
                <p className="font-inter text-sm text-white/40 ml-5 pl-2">Track your applications across domains.</p>
                {apps.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 ml-5 pl-2 rounded-full bg-at-teal/10 border border-at-teal/20">
                        <span className="font-space text-[11px] text-at-teal tracking-wider">{apps.length}/6 Applied</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"><div className="h-5 w-32 bg-white/10 rounded mb-2" /><div className="h-4 w-48 bg-white/5 rounded" /></div>
                ))}</div>
            ) : apps.length === 0 ? (
                <div className="bg-at-pink/10 border border-at-pink/20 rounded-xl p-8 text-center">
                    <p className="font-inter text-white/60 mb-4">You haven&apos;t applied to any domains yet.</p>
                    <Link href="/register" className="font-heading text-sm px-6 py-2.5 bg-at-pink text-white tracking-wider hover:bg-at-orange transition-colors rounded-lg inline-block">
                        Register Now
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {apps.map((app: any) => {
                            const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
                            const d = app.domain;
                            return (
                                <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{d?.icon || "📋"}</span>
                                            <h3 className="font-heading text-base text-white tracking-wider">{d?.name || "Unknown"}</h3>
                                        </div>
                                        <span className={`font-space text-[10px] font-bold ${s.color} ${s.bg} border ${s.border} px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    <p className="font-space text-xs text-white/30">📍 {d?.venue || "TBD"}</p>
                                    {app.status === "accepted" && d?.whatsapp_link && (
                                        <a href={d.whatsapp_link} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-3 font-heading text-xs px-4 py-2 bg-at-teal text-at-dark tracking-wider rounded-lg hover:opacity-90 transition">
                                            Join WhatsApp Group
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Domain</th>
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Venue</th>
                                    <th className="text-left px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Status</th>
                                    <th className="text-right px-5 py-3 font-heading text-xs text-at-pink tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app: any) => {
                                    const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
                                    const d = app.domain;
                                    return (
                                        <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-3"><div className="flex items-center gap-2"><span>{d?.icon || "📋"}</span><span className="font-inter text-sm text-white font-medium">{d?.name || "Unknown"}</span></div></td>
                                            <td className="px-5 py-3 font-space text-xs text-white/40">{d?.venue || "TBD"}</td>
                                            <td className="px-5 py-3"><span className={`font-space text-[10px] font-bold ${s.color} ${s.bg} border ${s.border} px-3 py-1.5 rounded-full uppercase tracking-wider`}>{s.label}</span></td>
                                            <td className="px-5 py-3 text-right">
                                                {app.status === "accepted" && d?.whatsapp_link ? (
                                                    <a href={d.whatsapp_link} target="_blank" rel="noopener noreferrer"
                                                        className="font-heading text-xs px-4 py-2 bg-at-teal text-at-dark tracking-wider rounded-lg hover:opacity-90 transition inline-block">
                                                        Join Group
                                                    </a>
                                                ) : <span className="font-space text-xs text-white/20">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
