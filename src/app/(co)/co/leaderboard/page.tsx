"use client";

import { useState, useEffect, useTransition } from "react";
import { getApplicantsForDomain, suggestAcceptReject } from "@/actions/co";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";

export default function COLeaderboardPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const r = await getApplicantsForDomain();
        if (r.data) setApplicants(r.data);
        setLoading(false);
    }

    function handleAction(appId: string, status: "accepted" | "rejected") {
        startTransition(async () => {
            const r = await suggestAcceptReject(appId, status);
            if (r.error) setMessage({ text: r.error, type: "error" });
            else { setMessage({ text: `Marked ${status.toUpperCase()}`, type: "success" }); loadData(); }
            setTimeout(() => setMessage(null), 2000);
        });
    }

    // Only show applicants who have been interviewed (done), sorted by score
    const sorted = [...applicants]
        .filter((a: any) => a.interview_done)
        .filter((a: any) => {
            const u = a.user;
            if (!u) return false;
            const q = search.toLowerCase();
            return (u.name.toLowerCase().includes(q) || u.srn.toLowerCase().includes(q)) && (yearFilter ? u.year === yearFilter : true);
        })
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-wider uppercase">Leaderboard</h1>
                <p className="font-inter text-sm text-white/40 mt-2">Ranked by score. Accept or reject candidates.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input type="text" placeholder="Search by name or SRN..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 sm:max-w-sm bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-inter text-base text-white placeholder-white/30 outline-none focus:border-at-pink/50 transition" />
                <select value={yearFilter || ""} onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="bg-[#161b22] border border-white/10 rounded-lg px-4 py-2.5 font-inter text-base text-white outline-none focus:border-at-pink/50 appearance-none cursor-pointer">
                    <option value="" className="bg-[#161b22] text-white">All Years</option>
                    <option value="1" className="bg-[#161b22] text-white">1st Year</option>
                    <option value="2" className="bg-[#161b22] text-white">2nd Year</option>
                    <option value="3" className="bg-[#161b22] text-white">3rd Year</option>
                    <option value="4" className="bg-[#161b22] text-white">4th Year</option>
                </select>
            </div>

            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg font-inter text-sm font-semibold ${message.type === "success" ? "bg-at-teal/20 border border-at-teal/30 text-at-teal" : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}>{message.text}</div>
            )}

            {loading ? (
                <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => (<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"><div className="h-5 w-48 bg-white/10 rounded mb-2" /><div className="h-4 w-32 bg-white/5 rounded" /></div>))}</div>
            ) : sorted.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center">
                    <p className="font-inter text-base text-white/40">No interviewed applicants yet.</p>
                    <p className="font-inter text-sm text-white/20 mt-1">Mark interviews as done in Recruitments first.</p>
                </div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {sorted.map((app: any, idx: number) => {
                            const u = app.user;
                            return (
                                <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-heading text-xl text-at-pink w-8">{idx + 1}</span>
                                            <div>
                                                <h3 className="font-heading text-base text-white tracking-wide">{u?.name}</h3>
                                                <p className="font-space text-xs text-white/40">{u?.srn} · Year {u?.year}</p>
                                            </div>
                                        </div>
                                        <div className="bg-at-pink/20 border border-at-pink/30 rounded-lg px-3 py-1.5">
                                            <span className="font-heading text-xl text-at-pink">{app.score || "—"}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        {app.status === "accepted" ? (
                                            <span className="font-inter text-sm font-semibold text-green-400 bg-green-400/15 border border-green-400/30 px-4 py-2.5 rounded-lg uppercase flex-1 text-center">Accepted ✓</span>
                                        ) : app.status === "rejected" ? (
                                            <span className="font-inter text-sm font-semibold text-red-400 bg-red-400/15 border border-red-400/30 px-4 py-2.5 rounded-lg uppercase flex-1 text-center">Rejected</span>
                                        ) : (
                                            <>
                                                <button onClick={() => handleAction(app.id, "accepted")} disabled={isPending}
                                                    className="flex-1 font-heading text-sm py-2.5 bg-at-teal text-at-dark uppercase tracking-wider rounded-lg hover:opacity-90 transition disabled:opacity-40">Accept</button>
                                                <button onClick={() => handleAction(app.id, "rejected")} disabled={isPending}
                                                    className="flex-1 font-heading text-sm py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider rounded-lg hover:bg-red-500/30 transition disabled:opacity-40">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider w-14">#</th>
                                    <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Name</th>
                                    <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">SRN</th>
                                    <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Year</th>
                                    <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Score</th>
                                    <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((app: any, idx: number) => {
                                    const u = app.user;
                                    return (
                                        <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-4 font-heading text-base text-at-pink">{idx + 1}</td>
                                            <td className="px-5 py-4 font-inter text-base text-white font-medium">{u?.name}</td>
                                            <td className="px-5 py-4 font-space text-sm text-white/60">{u?.srn}</td>
                                            <td className="px-5 py-4 text-center font-space text-sm text-white/50">{u?.year}</td>
                                            <td className="px-5 py-4 text-center font-heading text-xl text-at-pink">{app.score || "—"}</td>
                                            <td className="px-5 py-4 text-center">
                                                {app.status === "accepted" ? (
                                                    <span className="font-inter text-xs font-semibold text-green-400 bg-green-400/15 border border-green-400/30 px-4 py-2 rounded-full uppercase">Accepted</span>
                                                ) : app.status === "rejected" ? (
                                                    <span className="font-inter text-xs font-semibold text-red-400 bg-red-400/15 border border-red-400/30 px-4 py-2 rounded-full uppercase">Rejected</span>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => handleAction(app.id, "accepted")} disabled={isPending}
                                                            className="font-heading text-xs px-4 py-2 bg-at-teal text-at-dark uppercase tracking-wider rounded-lg hover:opacity-90 transition disabled:opacity-40">Accept</button>
                                                        <button onClick={() => handleAction(app.id, "rejected")} disabled={isPending}
                                                            className="font-heading text-xs px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider rounded-lg hover:bg-red-500/30 transition disabled:opacity-40">Reject</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="font-space text-sm text-white/30 mt-3 text-right">{sorted.length} interviewed</p>
                </>
            )}

            {/* Tutorial */}
            <Tutorial pageKey="co-leaderboard" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
