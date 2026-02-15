"use client";

import { useState } from "react";
import { DOMAINS_DATA } from "@/lib/domains";
import { HOW_IT_WORKS_STEPS } from "@/lib/steps";
import { ReviewCardModal } from "@/components/ui/review-card";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";

// Darker, contrasted gradient colors
const CARD_COLORS = [
    { bg: 'linear-gradient(135deg, #c4245a, #9e1d48)', accent: '#FF3378' },
    { bg: 'linear-gradient(135deg, #c4622e, #a3502a)', accent: '#F47B58' },
    { bg: 'linear-gradient(135deg, #2a8f88, #1e6e69)', accent: '#4ECDC4' },
    { bg: 'linear-gradient(135deg, #2d3561, #1e2545)', accent: '#8892b0' },
];

// Domain core info
const DOMAIN_CORES: Record<string, { coreName: string; coreTitle: string }> = {
    tech: { coreName: "Ashmith", coreTitle: "Tech Core" },
    finance: { coreName: "Pranav", coreTitle: "Finance Core" },
    sni: { coreName: "Purujit", coreTitle: "Stage & Infra Core" },
    disco: { coreName: "Hariharan", coreTitle: "Disco Core" },
    logistics: { coreName: "Likith", coreTitle: "Logistics Core" },
    prc: { coreName: "Anvika", coreTitle: "PRC Core" },
    inhouse: { coreName: "Rohit", coreTitle: "In-House Core" },
    sponsorship: { coreName: "Davis", coreTitle: "Sponsorship Core" },
    operations: { coreName: "Sanketh", coreTitle: "Operations Core" },
    media: { coreName: "Nithila", coreTitle: "Media Core" },
    design: { coreName: "Sahana", coreTitle: "Design Core" },
    hospitality: { coreName: "Vamsi", coreTitle: "Hospitality Core" },
    cultural: { coreName: "Smrithi", coreTitle: "Cultural Core" },
    fyi: { coreName: "X", coreTitle: "FYI Core" },
};

export default function DomainsPage() {
    const [selectedDomain, setSelectedDomain] = useState<(typeof DOMAINS_DATA)[number] | null>(null);
    const router = useRouter();

    return (
        <div>
            {/* Header + CTA row */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-10 rounded-full bg-at-pink" />
                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white tracking-wider">EXPLORE DOMAINS</h1>
                    </div>
                    <p className="font-inter text-base text-white/40 ml-5 pl-2">Find where you belong. Pick your crew.</p>
                    <div className="flex flex-wrap gap-2 mt-4 ml-5 pl-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-at-pink/10 border border-at-pink/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-pink" />
                            <span className="font-space text-[11px] text-at-pink tracking-wider">14 Domains</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-at-teal/10 border border-at-teal/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-teal" />
                            <span className="font-space text-[11px] text-at-teal tracking-wider">Open for All Years</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/register")}
                    className="inline-flex items-center gap-2 font-heading tracking-wider text-base px-8 py-3 bg-at-pink text-white rounded-xl hover:bg-at-orange transition-all duration-200 shadow-[0_0_20px_rgba(255,51,120,0.2)] hover:shadow-[0_0_30px_rgba(244,123,88,0.3)] shrink-0"
                >
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Domain Cards — 2 per row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {DOMAINS_DATA.map((domain, index) => {
                    const color = CARD_COLORS[index % CARD_COLORS.length];
                    return (
                        <div
                            key={domain.slug}
                            className="group relative rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                            style={{ background: color.bg }}
                            onClick={() => setSelectedDomain(domain)}
                        >
                            <div className="absolute inset-0 opacity-[0.06]" style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '0.5rem 0.5rem',
                            }} />

                            <div className="absolute top-0 right-6 h-14 w-10 bg-white/90 [clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_50%_75%,_0%_100%)] flex items-start justify-center pt-2.5">
                                <span className="font-heading text-lg" style={{ color: color.accent }}>{domain.icon}</span>
                            </div>

                            <div className="relative p-6 flex flex-col min-h-[190px]">
                                <h3 className="font-heading text-2xl text-white tracking-wider pr-14">{domain.name}</h3>
                                <p className="font-inter text-sm text-white/90 leading-relaxed mt-2 max-w-[90%]">{domain.description}</p>

                                <div className="h-px bg-white/20 my-4" />

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-white/70" />
                                        <span className="font-space text-sm text-white/90 font-medium">{domain.venue}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedDomain(domain); }}
                                        className="rounded-full bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm font-space font-semibold text-white hover:bg-white/30 transition-colors"
                                    >
                                        Know More
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== HOW IT WORKS ===== */}
            <div className="mt-16 mb-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-at-orange/30 bg-at-orange/10 mb-4">
                        <span className="font-space text-[11px] tracking-[0.15em] uppercase text-at-orange">5 Simple Steps</span>
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wider">HOW IT WORKS</h2>
                    <p className="font-inter text-sm text-white/40 mt-2">From login to results — the full process.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors duration-200">
                            <div className="font-heading text-2xl mb-2" style={{ color: step.color, opacity: 0.8 }}>{step.num}</div>
                            <h3 className="font-heading text-base text-white tracking-wider mb-1.5">{step.title}</h3>
                            <p className="font-inter text-[11px] text-white/40 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Know More Modal */}
            {selectedDomain && (() => {
                const core = DOMAIN_CORES[selectedDomain.slug] || { coreName: "TBD", coreTitle: `${selectedDomain.name} Core` };
                return (
                    <ReviewCardModal
                        open={!!selectedDomain}
                        onClose={() => setSelectedDomain(null)}
                        name={core.coreName}
                        handle={core.coreTitle}
                        review={`${selectedDomain.description} ${selectedDomain.what_they_do}`}
                        rating={5}
                    />
                );
            })()}
        </div>
    );
}
