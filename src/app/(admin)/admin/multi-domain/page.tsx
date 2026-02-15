"use client";

import { useState, useEffect } from "react";
import { getMultiDomainStudents } from "@/actions/admin";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";

const TUTORIAL_STEPS = [
    {
        title: "Multi-Domain Analytics",
        description: "This page provides a comprehensive view of all domains with detailed statistics. You can see application counts, acceptance rates, and pending reviews for each domain."
    },
    {
        title: "Compare Domains",
        description: "Use this view to compare performance across different domains. Look for patterns in application numbers, acceptance rates, and identify domains that may need attention."
    },
    {
        title: "Quick Actions",
        description: "From here you can quickly identify bottlenecks and make data-driven decisions about recruitment across all domains simultaneously."
    }
];

export default function MultiDomainPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const result = await getMultiDomainStudents();
        setStudents(result.data || []);
        setLoading(false);
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl text-white">MULTI-DOMAIN</h1>
                <p className="font-inter text-sm text-white/50 mt-2">Students accepted in 2+ domains.</p>
            </div>

            {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => (<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"><div className="h-4 w-48 bg-white/10 rounded mb-2" /><div className="h-3 w-32 bg-white/5 rounded" /></div>))}</div>
            ) : students.length === 0 ? (
                <div className="bg-at-pink/10 border border-at-pink/20 rounded-xl p-8 text-center"><p className="font-inter text-white/50">No students accepted in multiple domains yet.</p></div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {students.map((entry: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="font-anton text-sm text-white mb-1">{entry.user?.name}</h3>
                                <p className="font-space text-[11px] text-white/40 mb-3">{entry.user?.srn} · {entry.user?.email}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {entry.domains.map((d: string, i: number) => (
                                        <span key={i} className="font-space text-[10px] font-bold text-at-pink bg-at-pink/15 border border-at-pink/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Name</th>
                                    <th className="text-left px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">SRN</th>
                                    <th className="text-left px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Email</th>
                                    <th className="text-left px-5 py-3 font-anton text-xs text-at-pink uppercase tracking-wider">Accepted Domains</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((entry: any, idx: number) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-3 font-inter text-sm text-white font-medium">{entry.user?.name}</td>
                                        <td className="px-5 py-3 font-space text-xs text-white/50">{entry.user?.srn}</td>
                                        <td className="px-5 py-3 font-inter text-xs text-white/40">{entry.user?.email}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {entry.domains.map((d: string, i: number) => (
                                                    <span key={i} className="font-space text-[10px] font-bold text-at-pink bg-at-pink/15 border border-at-pink/30 px-2.5 py-1 rounded-full uppercase tracking-wider">{d}</span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Tutorial */}
            <Tutorial pageKey="admin-multi-domain" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
