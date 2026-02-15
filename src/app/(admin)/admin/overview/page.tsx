"use client";

import { useState, useEffect } from "react";
import { getOverviewStats } from "@/actions/admin";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStats(); }, []);

    async function loadStats() {
        const result = await getOverviewStats();
        if (!result.error) setStats(result);
        setLoading(false);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl text-white">SYSTEM OVERVIEW</h1>
                <p className="font-inter text-sm text-white/50 mt-2">High-level stats across all domains.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map(i => (<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"><div className="h-8 w-20 bg-white/10 rounded mb-2" /><div className="h-4 w-32 bg-white/5 rounded" /></div>))}
                </div>
            ) : stats ? (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        <div className="bg-at-pink/15 border border-at-pink/30 rounded-xl p-5 text-center">
                            <p className="font-anton text-5xl text-at-pink">{stats.totalStudents}</p>
                            <p className="font-space text-xs text-white/50 mt-2 uppercase tracking-wider">Registered Students</p>
                        </div>
                        <div className="bg-at-teal/15 border border-at-teal/30 rounded-xl p-5 text-center">
                            <p className="font-anton text-5xl text-at-teal">{stats.totalApplications}</p>
                            <p className="font-space text-xs text-white/50 mt-2 uppercase tracking-wider">Total Applications</p>
                        </div>
                        <div className="bg-at-orange/15 border border-at-orange/30 rounded-xl p-5 text-center">
                            <p className="font-anton text-5xl text-at-orange">{stats.totalAccepted}</p>
                            <p className="font-space text-xs text-white/50 mt-2 uppercase tracking-wider">Total Accepted</p>
                        </div>
                    </div>

                    {/* Domain-wise breakdown */}
                    <h2 className="font-anton text-xl text-white mb-4">DOMAIN-WISE BREAKDOWN</h2>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {stats.domainStats?.map((ds: any) => (
                            <div key={ds.domain_id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="font-anton text-sm text-white mb-3">{ds.domain_name}</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center bg-white/5 border border-white/10 rounded-lg p-2">
                                        <p className="font-anton text-lg text-white">{ds.total_applicants}</p>
                                        <p className="font-space text-[9px] text-white/40 uppercase">Applied</p>
                                    </div>
                                    <div className="text-center bg-at-teal/10 border border-at-teal/20 rounded-lg p-2">
                                        <p className="font-anton text-lg text-at-teal">{ds.accepted}</p>
                                        <p className="font-space text-[9px] text-at-teal/60 uppercase">Accept</p>
                                    </div>
                                    <div className="text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                        <p className="font-anton text-lg text-red-400">{ds.rejected}</p>
                                        <p className="font-space text-[9px] text-red-400/60 uppercase">Reject</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Domain</th>
                                    <th className="text-center px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Applicants</th>
                                    <th className="text-center px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Accepted</th>
                                    <th className="text-center px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Rejected</th>
                                    <th className="text-center px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.domainStats?.map((ds: any) => (
                                    <tr key={ds.domain_id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-3 font-inter text-sm text-white font-medium">{ds.domain_name}</td>
                                        <td className="px-5 py-3 text-center font-space text-sm text-white">{ds.total_applicants}</td>
                                        <td className="px-5 py-3 text-center font-space text-sm text-at-teal font-bold">{ds.accepted}</td>
                                        <td className="px-5 py-3 text-center font-space text-sm text-red-400 font-bold">{ds.rejected}</td>
                                        <td className="px-5 py-3 text-center font-space text-sm text-white/40">{ds.pending}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="bg-at-pink/10 border border-at-pink/20 rounded-xl p-8 text-center">
                    <p className="font-inter text-white/50">Failed to load stats. Ensure you&apos;re logged in as SuperAdmin.</p>
                </div>
            )}

            {/* Tutorial */}
            <Tutorial pageKey="admin-overview" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
