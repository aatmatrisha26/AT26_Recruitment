"use client";

import { useState, useEffect } from "react";
import { getCODomainInfo } from "@/actions/co";
import { Users, CheckCircle, Clock, XCircle, MapPin, MessageCircle, Star } from "lucide-react";

export default function CODashboardPage() {
    const [domain, setDomain] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const r = await getCODomainInfo();
            if (r.domain) setDomain(r.domain);
            if (r.stats) setStats(r.stats);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                            <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                            <div className="h-4 w-24 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 animate-pulse">
                    <div className="h-6 w-48 bg-white/10 rounded mb-4" />
                    <div className="h-4 w-full bg-white/5 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-wider uppercase">
                    {domain?.name || "Dashboard"}
                </h1>
                <p className="font-inter text-sm text-white/50 mt-2">
                    CO Dashboard — Manage your domain&apos;s recruitment pipeline
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={<Users className="h-5 w-5" />}
                    value={stats?.total || 0}
                    label="Total Applicants"
                    color="#FF3378"
                />
                <StatCard
                    icon={<Clock className="h-5 w-5" />}
                    value={stats?.pending || 0}
                    label="Interview Pending"
                    color="#F47B58"
                />
                <StatCard
                    icon={<CheckCircle className="h-5 w-5" />}
                    value={stats?.accepted || 0}
                    label="Accepted"
                    color="#4ECDC4"
                />
                <StatCard
                    icon={<XCircle className="h-5 w-5" />}
                    value={stats?.rejected || 0}
                    label="Rejected"
                    color="#EF4444"
                />
            </div>

            {/* Domain Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="font-heading text-lg text-white tracking-wider uppercase mb-4">Domain Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <InfoRow icon={<MapPin className="h-4 w-4 text-at-pink" />} label="Venue" value={domain?.venue || "—"} />
                        <InfoRow icon={<Star className="h-4 w-4 text-at-orange" />} label="What They Do" value={domain?.what_they_do || "—"} />
                    </div>
                    <div className="space-y-4">
                        <InfoRow icon={<MessageCircle className="h-4 w-4 text-at-teal" />} label="WhatsApp Group" value={domain?.whatsapp_link ? "Linked ✓" : "Not set"} />
                        <div>
                            <p className="font-space text-[10px] text-white/30 uppercase tracking-wider mb-1">Description</p>
                            <p className="font-inter text-sm text-white/60 leading-relaxed">{domain?.description || "No description"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            {stats && stats.total > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="font-heading text-lg text-white tracking-wider uppercase mb-4">Progress</h2>
                    <div className="space-y-3">
                        <ProgressBar label="Interviews Done" current={stats.interviewed} total={stats.total} color="#4ECDC4" />
                        <ProgressBar label="Scored" current={stats.scored} total={stats.total} color="#FF3378" />
                        <ProgressBar label="Decisions Made" current={stats.accepted + stats.rejected} total={stats.total} color="#F47B58" />
                    </div>
                    <p className="font-space text-[10px] text-white/20 mt-4">
                        Avg Score: {stats.avgScore ? stats.avgScore.toFixed(1) : "—"} / 10
                    </p>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
                    {icon}
                </div>
            </div>
            <p className="font-heading text-2xl md:text-3xl tracking-wider" style={{ color }}>{value}</p>
            <p className="font-space text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <p className="font-space text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
            </div>
            <p className="font-inter text-sm text-white/70">{value}</p>
        </div>
    );
}

function ProgressBar({ label, current, total, color }: { label: string; current: number; total: number; color: string }) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-space text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                <span className="font-space text-[10px] text-white/40">{current}/{total} ({pct}%)</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
        </div>
    );
}
