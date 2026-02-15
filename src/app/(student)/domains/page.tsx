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
    { title: "Welcome to AT26!", description: "This is where you explore all 14 domains. Each domain has unique roles and responsibilities. Click on any card to learn more." },
    { title: "Find Your Match", description: "Look through the domains. Check their venues, descriptions, and what they do. You can apply to up to 6 domains!" },
    { title: "Ready to Register?", description: "Once you've explored, click 'Register Now' to apply. You'll be able to select your preferred domains." }
];

const NEON_COLORS = ['#FF206E', '#00F0FF', '#B026FF', '#FF9E64', '#4ADE80', '#FF206E', '#00F0FF'];

export default function DomainsPage() {
    const [selectedDomain, setSelectedDomain] = useState<(typeof DOMAINS_DATA)[number] | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const router = useRouter();

    return (
        <div>
            {/* Header + CTA */}
            <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 sm:h-10 rounded-full" style={{ background: 'linear-gradient(180deg, #FF206E, #FF9E64)' }} />
                        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl text-at-text tracking-tight">EXPLORE DOMAINS</h1>
                    </div>
                    <p className="font-inter text-xs sm:text-sm text-at-text/30 ml-5 pl-2">Find where you belong. Pick your crew.</p>
                    <div className="flex flex-wrap gap-2 mt-3 ml-5 pl-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neon-border-pink bg-at-pink/5 backdrop-blur-sm animate-neon-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-pink" />
                            <span className="font-retro text-[9px] text-at-pink tracking-widest">14 DOMAINS</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neon-border-cyan bg-at-cyan/5 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-at-teal" />
                            <span className="font-retro text-[9px] text-at-teal tracking-widest">OPEN FOR ALL</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/register")}
                    className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 shrink-0 w-full sm:w-auto justify-center"
                >
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Domain Cards — responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {DOMAINS_DATA.map((domain, index) => {
                    const neonColor = NEON_COLORS[index % NEON_COLORS.length];
                    return (
                        <div
                            key={domain.slug}
                            className="group glass-card relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setSelectedDomain(domain)}
                            style={{ borderColor: `${neonColor}15`, background: `radial-gradient(ellipse at 0% 100%, ${neonColor}18 0%, transparent 55%), radial-gradient(ellipse at 100% 0%, ${neonColor}0D 0%, transparent 55%), rgba(255,255,255,0.02)` }}
                        >
                            {/* Icon badge */}
                            <div className="absolute top-3 right-4 sm:top-4 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                style={{ background: `${neonColor}08`, border: `1px solid ${neonColor}15` }}>
                                <span className="text-sm sm:text-base group-hover:scale-110 transition-transform" style={{ color: `${neonColor}90` }}>{domain.icon}</span>
                            </div>

                            {/* Glow line on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)` }} />

                            <div className="relative p-4 sm:p-6 flex flex-col min-h-36 sm:min-h-47.5">
                                <h3 className="font-heading text-lg sm:text-2xl text-at-text tracking-tight pr-10 sm:pr-14 group-hover:text-gradient-heat transition-all duration-300">{domain.name}</h3>
                                <p className="font-inter text-xs sm:text-sm text-at-text/40 leading-relaxed mt-1.5 sm:mt-2 max-w-[90%] group-hover:text-at-text/60 transition-colors duration-300 line-clamp-2">{domain.description}</p>

                                <div className="h-px bg-white/5 my-3 sm:my-4 group-hover:bg-at-pink/10 transition-colors duration-300" />

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-at-text/25" />
                                        <span className="font-inter text-xs sm:text-sm text-at-text/40">{domain.venue}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedDomain(domain); }}
                                        className="retro-badge text-[8px] sm:text-[9px] px-3 py-1.5 text-at-text/50 border border-white/10 hover:border-at-pink/30 hover:text-at-pink rounded-lg transition-all duration-300"
                                    >
                                        KNOW MORE
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== HOW IT WORKS ===== */}
            <div className="mt-12 sm:mt-16 mb-4">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border-pink bg-at-peach/5 backdrop-blur-sm mb-4">
                        <span className="font-retro text-[9px] tracking-widest uppercase text-at-peach">5 STEPS</span>
                    </div>
                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-at-text tracking-tight">HOW IT WORKS</h2>
                    <p className="font-inter text-xs sm:text-sm text-at-text/30 mt-2">From login to results — the full process.</p>
                </div>

                {/* Desktop Flow */}
                <div className="hidden lg:grid grid-cols-5 gap-3 relative">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative group">
                            {i < 4 && (
                                <div className="absolute top-13.75 left-[calc(50%+40px)] w-[calc(100%-20px)] flex items-center justify-center pointer-events-none z-10">
                                    <svg className="w-6 h-3 animate-pulse-glow" style={{ color: step.color, opacity: 0.5 }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="glass-card relative rounded-xl p-4 h-full">
                                <div className="w-9 h-9 rounded-lg mb-2 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    style={{ background: `${step.color}10`, border: `1px solid ${step.color}15` }}>
                                    <div className="font-retro text-sm" style={{ color: step.color }}>{step.num}</div>
                                </div>
                                <h3 className="font-heading text-xs text-at-text tracking-tight mb-1.5 uppercase">{step.title}</h3>
                                <p className="font-inter text-[10px] text-at-text/30 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile/Tablet Timeline */}
                <div className="lg:hidden space-y-3">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative flex gap-3 items-start">
                            {i < 4 && (
                                <div className="absolute top-10 left-4.5 w-0.5 h-[calc(100%+4px)]"
                                    style={{ background: `linear-gradient(to bottom, ${step.color}15, ${HOW_IT_WORKS_STEPS[i + 1].color}15)` }} />
                            )}
                            <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center z-10"
                                style={{ background: `${step.color}10`, border: `1px solid ${step.color}15` }}>
                                <span className="font-retro text-xs" style={{ color: step.color }}>{step.num}</span>
                            </div>
                            <div className="flex-1 glass-card rounded-xl p-3">
                                <h3 className="font-heading text-xs text-at-text tracking-tight mb-1 uppercase">{step.title}</h3>
                                <p className="font-inter text-[10px] text-at-text/30 leading-relaxed">{step.desc}</p>
                            </div>
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

            <Tutorial pageKey="domains" steps={TUTORIAL_STEPS} forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
            <HelpButton onClick={() => setShowTutorial(true)} />
        </div>
    );
}
