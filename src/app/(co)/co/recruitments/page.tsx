"use client";

import { useState, useEffect, useTransition } from "react";
import { getApplicantsForDomain, markInterviewDone } from "@/actions/co";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";

const TUTORIAL_STEPS = [
    { title: "Interview Applicants", description: "See all applicants. Enter their score (1-10) after the interview and click ✓ to mark it done." },
    { title: "Search & Filter", description: "Use the search bar to find applicants by name/SRN. Filter by year if needed." }
];

export default function CORecruitmentsPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState<number | null>(null);
    const [scores, setScores] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadData() {
        const r = await getApplicantsForDomain();
        if (r.data) setApplicants(r.data);
        setLoading(false);
    }

    function handleMarkDone(appId: string) {
        const scoreVal = scores[appId];
        const parsedScore = scoreVal ? parseInt(scoreVal) : undefined;
        if (parsedScore !== undefined && (parsedScore < 1 || parsedScore > 10 || isNaN(parsedScore))) {
            setMessage({ text: "Score must be between 1 and 10", type: "error" });
            setTimeout(() => setMessage(null), 2000);
            return;
        }
        startTransition(async () => {
            const r = await markInterviewDone(appId, parsedScore);
            if (r.error) setMessage({ text: r.error, type: "error" });
            else { setMessage({ text: "Interview marked done!", type: "success" }); loadData(); }
            setTimeout(() => setMessage(null), 2000);
        });
    }

    // Only show applicants who have NOT been marked done
    const filtered = applicants
        .filter((a: any) => !a.interview_done)
        .filter((a: any) => {
            const u = a.user;
            if (!u) return false;
            const q = search.toLowerCase();
            const matchesSearch = u.name.toLowerCase().includes(q) || u.srn.toLowerCase().includes(q);
            const matchesYear = yearFilter ? u.year === yearFilter : true;
            return matchesSearch && matchesYear;
        });

    const pendingCount = applicants.filter((a: any) => !a.interview_done).length;

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-wider uppercase">Recruitments</h1>
                <p className="font-inter text-sm text-white/40 mt-2">{pendingCount} pending interview{pendingCount !== 1 ? "s" : ""}</p>
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
            ) : filtered.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center">
                    <p className="font-inter text-base text-white/40">No pending interviews.</p>
                    <p className="font-inter text-sm text-white/20 mt-1">All done? Check the Leaderboard to accept or reject.</p>
                </div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {filtered.map((app: any) => {
                            const u = app.user;
                            return (
                                <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-heading text-base text-white tracking-wide">{u?.name}</h3>
                                            <p className="font-space text-xs text-white/40 mt-0.5">{u?.srn}</p>
                                            <p className="font-inter text-xs text-white/30 mt-0.5">{u?.email} · Year {u?.year}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-2 flex-1">
                                            <label className="font-heading text-xs text-white/50 uppercase tracking-wider">Score:</label>
                                            <input type="number" min="1" max="10"
                                                value={scores[app.id] || ""}
                                                onChange={(e) => setScores(prev => ({ ...prev, [app.id]: e.target.value }))}
                                                className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center font-space text-base text-white outline-none focus:border-at-pink/50" placeholder="1-10" />
                                        </div>
                                        <button onClick={() => handleMarkDone(app.id)} disabled={isPending}
                                            className="font-heading text-xs px-4 py-2 bg-at-teal text-at-dark uppercase tracking-wider rounded-lg hover:opacity-90 transition disabled:opacity-40">Mark Done</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Name</th>
                                        <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">SRN</th>
                                        <th className="text-left px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Email</th>
                                        <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Year</th>
                                        <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Score</th>
                                        <th className="text-center px-5 py-4 font-heading text-sm text-at-pink uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((app: any) => {
                                        const u = app.user;
                                        return (
                                            <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                                <td className="px-5 py-4 font-inter text-base text-white font-medium">{u?.name}</td>
                                                <td className="px-5 py-4 font-space text-sm text-white/60">{u?.srn}</td>
                                                <td className="px-5 py-4 font-inter text-sm text-white/50">{u?.email}</td>
                                                <td className="px-5 py-4 text-center font-space text-sm text-white/50">{u?.year}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <input type="number" min="1" max="10"
                                                        value={scores[app.id] || ""}
                                                        onChange={(e) => setScores(prev => ({ ...prev, [app.id]: e.target.value }))}
                                                        className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center font-space text-base text-white outline-none focus:border-at-pink/50" placeholder="—" />
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <button onClick={() => handleMarkDone(app.id)} disabled={isPending}
                                                        className="font-heading text-xs px-4 py-2 bg-at-pink text-white uppercase tracking-wider rounded-lg hover:bg-at-orange transition disabled:opacity-40">Mark Done</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="font-space text-sm text-white/30 mt-3 text-right">{filtered.length} pending</p>
                </>
            )}

            {/* Tutorial */}
            <Tutorial pageKey="co-recruitments" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
