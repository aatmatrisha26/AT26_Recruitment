"use client";

import { useState, useEffect, useTransition } from "react";
import { freezeResults, unfreezeResults, publishResults, updateWhatsAppLink, exportCSV } from "@/actions/admin";
import { getDomains, getSystemSettings } from "@/actions/applications";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";

const TUTORIAL_STEPS = [
    {
        title: "Upload Results",
        description: "This page allows you to bulk upload recruitment results via CSV file. Download the template first to ensure your file is formatted correctly."
    },
    {
        title: "Manage Settings",
        description: "You can freeze/unfreeze results, publish them to students, update WhatsApp links for each domain, and export data as CSV for analysis."
    },
    {
        title: "Domain Controls",
        description: "Each domain has individual controls for WhatsApp links. Make sure to update these links so students can join their respective domain groups after selection."
    }
];

export default function AdminUploadPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [whatsappLinks, setWhatsappLinks] = useState<Record<string, string>>({});
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const [domainsData, settingsData] = await Promise.all([getDomains(), getSystemSettings()]);
        setDomains(domainsData);
        setSettings(settingsData);
        const links: Record<string, string> = {};
        domainsData.forEach((d: any) => { links[d.id] = d.whatsapp_link || ""; });
        setWhatsappLinks(links);
        setLoading(false);
    }

    function showMsg(text: string, type: "success" | "error") {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    }

    function handleFreeze() {
        if (!confirm("Freeze all edits? COs cannot modify scores or suggestions.")) return;
        startTransition(async () => {
            const r = await freezeResults();
            if (r.error) showMsg(r.error, "error");
            else { showMsg("System frozen!", "success"); loadData(); }
        });
    }

    function handleUnfreeze() {
        startTransition(async () => {
            const r = await unfreezeResults();
            if (r.error) showMsg(r.error, "error");
            else { showMsg("System unfrozen!", "success"); loadData(); }
        });
    }

    function handlePublish() {
        if (!confirm("PUBLISH RESULTS? This pushes final statuses to all students.")) return;
        startTransition(async () => {
            const r = await publishResults();
            if (r.error) showMsg(r.error, "error");
            else { showMsg("Results published! 🎉", "success"); loadData(); }
        });
    }

    function handleUpdateLink(domainId: string) {
        const link = whatsappLinks[domainId]?.trim();
        if (!link) return;
        startTransition(async () => {
            const r = await updateWhatsAppLink(domainId, link);
            if (r.error) showMsg(r.error, "error");
            else showMsg("Link updated!", "success");
        });
    }

    function handleExport() {
        startTransition(async () => {
            const r = await exportCSV();
            if (r.csv) {
                const blob = new Blob([r.csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `at26-export-${new Date().toISOString().split("T")[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showMsg("CSV downloaded!", "success");
            } else showMsg("Failed to export", "error");
        });
    }

    if (loading) return (
        <div className="space-y-4">
            <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"><div className="h-4 w-32 bg-white/10 rounded mb-4" /><div className="h-10 w-full bg-white/5 rounded" /></div>
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl text-white">UPLOAD & PUBLISH</h1>
                <p className="font-inter text-sm text-white/50 mt-2">Freeze edits, publish results, and manage WhatsApp links.</p>
            </div>

            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg font-space text-sm font-bold ${message.type === "success" ? "bg-at-teal/20 border border-at-teal/30 text-at-teal" : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}>{message.text}</div>
            )}

            {/* System Controls */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                <h2 className="font-anton text-lg text-white mb-4">SYSTEM CONTROLS</h2>

                <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className={`h-3 w-3 rounded-full ${settings?.frozen ? "bg-red-400" : "bg-at-teal"}`} />
                    <span className="font-space text-sm font-bold text-white uppercase tracking-wider">
                        {settings?.frozen ? "FROZEN 🔒" : "ACTIVE ✅"}
                        {settings?.results_published && " · PUBLISHED"}
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    {!settings?.frozen ? (
                        <button onClick={handleFreeze} disabled={isPending}
                            className="font-anton text-xs px-5 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider rounded-lg hover:bg-red-500/30 transition disabled:opacity-40">
                            🔒 FREEZE ALL EDITS
                        </button>
                    ) : (
                        <button onClick={handleUnfreeze} disabled={isPending}
                            className="font-anton text-xs px-5 py-2.5 bg-at-teal text-at-dark uppercase tracking-wider rounded-lg hover:opacity-90 transition disabled:opacity-40">
                            🔓 UNFREEZE
                        </button>
                    )}

                    <button onClick={handlePublish} disabled={isPending || settings?.results_published}
                        className="font-anton text-xs px-5 py-2.5 bg-at-pink text-white uppercase tracking-wider rounded-lg hover:bg-at-orange transition disabled:opacity-40">
                        📢 PUBLISH RESULTS
                    </button>

                    <button onClick={handleExport} disabled={isPending}
                        className="font-anton text-xs px-5 py-2.5 bg-white/5 text-white border border-white/10 uppercase tracking-wider rounded-lg hover:bg-white/10 transition disabled:opacity-40">
                        📥 EXPORT CSV
                    </button>
                </div>
            </div>

            {/* WhatsApp Links */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h2 className="font-anton text-lg text-white mb-2">WHATSAPP GROUP LINKS</h2>
                <p className="font-inter text-xs text-white/40 mb-4">Add WhatsApp links per domain. Accepted students see a &quot;Join Group&quot; button.</p>

                <div className="space-y-3">
                    {domains.map((domain: any) => (
                        <div key={domain.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <span className="font-anton text-sm text-white min-w-[120px] uppercase">{domain.icon} {domain.name}</span>
                            <input
                                type="url"
                                placeholder="https://chat.whatsapp.com/..."
                                value={whatsappLinks[domain.id] || ""}
                                onChange={(e) => setWhatsappLinks(prev => ({ ...prev, [domain.id]: e.target.value }))}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-space text-xs text-white placeholder-white/20 outline-none focus:border-at-pink/50 transition"
                            />
                            <button onClick={() => handleUpdateLink(domain.id)} disabled={isPending || !whatsappLinks[domain.id]?.trim()}
                                className="font-anton text-xs px-4 py-2 bg-at-pink text-white uppercase tracking-wider rounded-lg hover:bg-at-orange transition disabled:opacity-40 sm:w-auto w-full">
                                SAVE
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* Tutorial */}
            <Tutorial pageKey="admin-upload" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />        </div>
    );
}
