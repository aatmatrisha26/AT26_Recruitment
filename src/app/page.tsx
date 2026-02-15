import Link from "next/link";
import { getSessionFromCookie } from "@/lib/auth";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { DOMAINS_DATA } from "@/lib/domains";
import HowItWorksSection from "@/components/ui/how-it-works";
import HeroBackdrop from "@/components/ui/hero-backdrop";

export default async function LandingPage() {
  const session = await getSessionFromCookie();

  const allDomains = DOMAINS_DATA.map(d => d.name.toUpperCase()).join(" \u2022 ");

  return (
    <main className="relative min-h-screen bg-at-void crt-overlay" style={{ overflowX: 'hidden' }}>
      {/* ===== ANIMATED BACKDROP ===== */}
      <HeroBackdrop />

      {/* ===== NAV ===== */}
      <nav className="relative z-50 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5">
        <Link href="/" className="font-heading text-xl sm:text-2xl lg:text-3xl tracking-tight text-at-text hover:text-gradient-heat transition-all duration-300">
          AATMATRISHA
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/domains" className="hidden sm:inline font-retro text-[10px] tracking-widest uppercase text-at-text/30 hover:text-at-pink transition-colors duration-300">
            Domains
          </Link>
          {session ? (
            <ProfileDropdown name={session.name} srn={session.srn} role={session.role} />
          ) : (
            <Link href="/api/auth/pesu"
              className="btn-pill btn-pill-primary text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5">
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 pt-12 pb-10 sm:pt-20 sm:pb-14" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <div className="relative w-full max-w-4xl text-center animate-fade-in-up">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-at-pink/20 bg-at-pink/5 backdrop-blur-sm mb-6 sm:mb-8 animate-fade-in-up-d1 animate-neon-pulse">
            <div className="w-2 h-2 rounded-full bg-at-pink animate-pulse" />
            <span className="font-retro text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-at-pink">Now Recruiting — AT&apos;26</span>
          </div>

          {/* Main heading — responsive text that never overflows */}
          <h1 className="font-heading leading-[0.9] text-at-text mb-1 animate-fade-in-up-d1 font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
            JOIN THE
          </h1>
          <h1 className="font-heading leading-[0.9] mb-5 sm:mb-6 animate-fade-in-up-d2 font-black tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
            <span className="text-glow-pink text-gradient-heat">HEATWAVE</span>
          </h1>

          {/* Accent line */}
          <div className="animate-fade-in-up-d2 mb-6 sm:mb-8">
            <span className="font-inter text-at-peach/60 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">est. 2026 · heatwave edition</span>
          </div>

          <p className="font-inter text-xs sm:text-sm md:text-base text-at-text/60 leading-relaxed mb-8 sm:mb-10 max-w-md mx-auto animate-fade-in-up-d2 px-4 sm:px-0">
            Pick your domain, show up for the interview, and become part of something legendary.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up-d3 px-4 sm:px-0">
            <Link
              href={
                session
                  ? (session.role === 'superadmin'
                    ? "/admin/overview"
                    : session.role.startsWith('CO_')
                      ? "/co"
                      : "/domains"
                  )
                  : "/api/auth/pesu"
              }
              className="btn-pill btn-pill-primary text-sm sm:text-base lg:text-lg px-8 sm:px-10 py-3 sm:py-4 inline-flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center font-bold tracking-wide"
            >
              {session
                ? (session.role === 'superadmin'
                  ? "Go to Admin Panel"
                  : session.role.startsWith('CO_')
                    ? "Go to CO Dashboard"
                    : "Go to Dashboard"
                )
                : "Join Recruitments"
              }
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-14 animate-fade-in-up-d4">
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl text-at-text">14</p>
              <p className="font-retro text-[8px] sm:text-[10px] text-at-text/60 uppercase tracking-widest font-semibold">Domains</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/20" />
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl text-at-pink">6 Max</p>
              <p className="font-retro text-[8px] sm:text-[10px] text-at-text/60 uppercase tracking-widest font-semibold">Applications</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/20" />
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl text-at-peach">2026</p>
              <p className="font-retro text-[8px] sm:text-[10px] text-at-text/60 uppercase tracking-widest font-semibold">Edition</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="relative z-10 border-t border-b border-white/6 bg-white/2">
        <div className="overflow-hidden py-3 sm:py-4">
          <div className="animate-marquee whitespace-nowrap flex">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-retro text-[10px] sm:text-xs tracking-[0.15em] text-at-text/70 mx-4 sm:mx-6 font-semibold">
                AATMATRISHA 2026 &bull; HEATWAVE &bull; {allDomains} &bull; APPLY NOW &bull;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorksSection />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 mt-8 sm:mt-12 px-6 sm:px-10 pb-8 sm:pb-10">
        <div className="h-px w-full mb-6 sm:mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,32,110,0.2), rgba(0,240,255,0.15), transparent)' }} />
        <div className="glass-card rounded-xl sm:rounded-2xl neon-border-pink max-w-md mx-auto px-6 py-5 sm:px-8 sm:py-6 text-center" style={{ boxShadow: '0 0 30px rgba(255,32,110,0.05)' }}>
          <p className="font-retro text-[9px] sm:text-[11px] tracking-[0.15em] uppercase text-at-text/60 mb-2 font-medium">
            Created by <span className="text-at-cyan">Dennis</span> & <span className="text-at-cyan">Ashmith</span>
          </p>
          <p className="font-retro text-[7px] sm:text-[9px] tracking-[0.12em] uppercase text-at-text/40">
            AT&apos;26 Tech Heads · All rights reserved
          </p>
        </div>
      </footer>
    </main>
  );
}
