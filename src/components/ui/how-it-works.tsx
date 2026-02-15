"use client";

import Link from "next/link";
import { HOW_IT_WORKS_STEPS } from "@/lib/steps";

export default function HowItWorksSection() {
  return (
    <section className="relative z-10 px-6 sm:px-10 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-at-orange/30 bg-at-orange/10 mb-5">
          <span className="font-space text-[11px] tracking-[0.15em] uppercase text-at-orange">5 Simple Steps</span>
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wider">HOW IT WORKS</h2>
        <p className="font-inter text-sm text-white/40 mt-3 max-w-md mx-auto">From login to results — here&apos;s everything you need to know.</p>
      </div>

      {/* Desktop: Horizontal Flow */}
      <div className="hidden lg:block relative">
        <div className="relative flex items-start justify-between gap-2">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={i} className="relative flex-1 group">
              {/* Step Card */}
              <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 h-full">
                {/* Number Badge */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, border: `1px solid ${step.color}40` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle, ${step.color}, transparent)` }} />
                  <span className="relative font-heading text-2xl tracking-wider z-10" style={{ color: step.color }}>{step.num}</span>
                </div>

                {/* Content */}
                <h3 className="font-heading text-base text-white tracking-wider mb-2 uppercase">{step.title}</h3>
                <p className="font-inter text-xs text-white/50 leading-relaxed">{step.desc}</p>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(to right, ${step.color}, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet: Vertical Layout */}
      <div className="lg:hidden space-y-6">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <div key={i} className="relative">
            <div className="flex gap-4 items-start group">
              {/* Number Badge */}
              <div className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, border: `1px solid ${step.color}40` }}>
                <span className="font-heading text-xl" style={{ color: step.color }}>{step.num}</span>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300">
                <h3 className="font-heading text-base text-white tracking-wider mb-1.5 uppercase">{step.title}</h3>
                <p className="font-inter text-xs text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA at Bottom */}
      <div className="text-center mt-12">
        <Link
          href="/domains"
          className="inline-flex items-center gap-3 font-heading tracking-wider text-base px-8 py-3.5 bg-gradient-to-r from-at-pink to-at-orange text-white rounded-xl hover:shadow-[0_0_30px_rgba(255,51,120,0.4)] transition-all duration-300 hover:scale-105"
        >
          Get Started Now
          <svg className="w-5 h-5 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <p className="font-space text-[10px] text-white/30 mt-3 uppercase tracking-wider">No fees · Open to all years</p>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
