"use client";

import { useState } from "react";
import { DOMAINS_DATA } from "@/lib/domains";
import { HOW_IT_WORKS_STEPS } from "@/lib/steps";
import { ReviewCardModal } from "@/components/ui/review-card";
import Tutorial from "@/components/ui/tutorial";
import HelpButton from "@/components/ui/help-button";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";

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

const TUTORIAL_STEPS = [
    {
        title: "Welcome to AT26!",
        description: "This is where you explore all 14 domains. Each domain has unique roles and responsibilities. Click on any card to learn more about what they do."
    },
    {
        title: "Find Your Match",
        description: "Look through the domains. Check their venues, descriptions, and what they do. You can apply to up to 6 domains, so choose wisely!"
    },
    {
        title: "Ready to Register?",
        description: "Once you've explored, click 'Register Now' to apply. You'll be able to select your preferred domains and submit your applications."
    }
];

export default function DomainsPage() {
    const [selectedDomain, setSelectedDomain] = useState<(typeof DOMAINS_DATA)[number] | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const router = useRouter();

    return (
        <div>
            {/* Header + CTA row */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-10 rounded-full bg-linear-to-b from-at-pink to-at-peach" />
                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-at-text tracking-tight">EXPLORE DOMAINS</h1>
                    </div>
                    <p className="font-inter text-base text-at-text/35 ml-5 pl-2">Find where you belong. Pick your crew.</p>
                    <div className="flex flex-wrap gap-2 mt-4 ml-5 pl-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-at-pink/5 border border-at-pink/15 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-pink" />
                            <span className="font-inter text-[11px] font-medium text-at-pink tracking-wider">14 Domains</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-at-teal/5 border border-at-teal/15 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-teal" />
                            <span className="font-inter text-[11px] font-medium text-at-teal tracking-wider">Open for All Years</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/register")}
                    className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-base px-8 py-3 shrink-0"
                >
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Domain Cards — Dark Glassmorphism, 2 per row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {DOMAINS_DATA.map((domain, index) => {
                    return (
                        <div
                            key={domain.slug}
                            className="group glass-card relative rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setSelectedDomain(domain)}
                        >
                            {/* Subtle icon badge */}
                            <div className="absolute top-4 right-5 w-10 h-10 rounded-full bg-at-pink/8 border border-at-pink/10 flex items-center justify-center group-hover:bg-at-pink/15 group-hover:border-at-pink/25 transition-all duration-300">
                                <span className="font-heading text-sm text-at-pink/70 group-hover:text-at-pink transition-colors">{domain.icon}</span>
                            </div>

                            <div className="relative p-6 flex flex-col min-h-47.5">
                                <h3 className="font-heading text-2xl text-at-text tracking-tight pr-14 group-hover:text-gradient-heat">{domain.name}</h3>
                                <p className="font-inter text-sm text-at-text/50 leading-relaxed mt-2 max-w-[90%] group-hover:text-at-text/65 transition-colors duration-300">{domain.description}</p>

                                <div className="h-px bg-white/6 my-4 group-hover:bg-at-pink/15 transition-colors duration-300" />

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-at-text/30" />
                                        <span className="font-inter text-sm text-at-text/50 font-medium">{domain.venue}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedDomain(domain); }}
                                        className="btn-pill rounded-full bg-white/6 backdrop-blur-sm border border-white/8 px-4 py-1.5 text-sm font-inter font-medium text-at-text/70 hover:bg-at-pink/10 hover:border-at-pink/20 hover:text-at-pink transition-all duration-300"
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-at-peach/20 bg-at-peach/5 backdrop-blur-sm mb-4">
                        <span className="font-inter text-[11px] font-medium tracking-[0.15em] uppercase text-at-peach">5 Simple Steps</span>
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl text-at-text tracking-tight">HOW IT WORKS</h2>
                    <p className="font-inter text-sm text-at-text/35 mt-2">From login to results — the full process.</p>
                </div>

                {/* Desktop Flow */}
                <div className="hidden lg:grid grid-cols-5 gap-3 relative">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative group">
                            {/* Arrow Connector */}
                            {i < 4 && (
                                <div className="absolute top-13.75 left-[calc(50%+40px)] w-[calc(100%-20px)] flex items-center justify-center pointer-events-none z-10">
                                    <svg className="w-8 h-4 animate-pulse-slow" style={{ color: step.color, opacity: 0.5 }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="glass-card relative rounded-2xl p-4 h-full">
                                <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    style={{ background: `${step.color}10`, border: `1px solid ${step.color}20` }}>
                                    <div className="font-heading text-lg" style={{ color: step.color }}>{step.num}</div>
                                </div>
                                <h3 className="font-heading text-sm text-at-text tracking-tight mb-1.5 uppercase">{step.title}</h3>
                                <p className="font-inter text-[11px] text-at-text/35 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile/Tablet Timeline */}
                <div className="lg:hidden space-y-4">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative flex gap-3 items-start">
                            {i < 4 && (
                                <div className="absolute top-12 left-5 w-0.5 h-[calc(100%+4px)]"
                                    style={{ background: `linear-gradient(to bottom, ${step.color}20, ${HOW_IT_WORKS_STEPS[i + 1].color}20)` }} />
                            )}
                            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                style={{ background: `${step.color}10`, border: `1px solid ${step.color}20` }}>
                                <span className="font-heading text-base" style={{ color: step.color }}>{step.num}</span>
                            </div>
                            <div className="flex-1 glass-card rounded-xl p-3.5">
                                <h3 className="font-heading text-sm text-at-text tracking-tight mb-1 uppercase">{step.title}</h3>
                                <p className="font-inter text-[11px] text-at-text/35 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
            `}</style>

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

            {/* Tutorial */}
            <Tutorial pageKey="domains" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
