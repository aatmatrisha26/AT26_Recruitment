import Link from "next/link";
import { getSessionFromCookie } from "@/lib/auth";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { DOMAINS_DATA } from "@/lib/domains";
import HowItWorksSection from "@/components/ui/how-it-works";

export default async function LandingPage() {
  const session = await getSessionFromCookie();

  const allDomains = DOMAINS_DATA.map(d => d.name.toUpperCase()).join(" \u2022 ");

  return (
    <main className="relative min-h-screen overflow-hidden bg-at-void">
      {/* ===== AMBIENT LIGHT LEAKS ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large pink/magenta orb — hero center background */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-175 h-175 rounded-full animate-heat-drift"
          style={{ background: 'radial-gradient(circle, rgba(255,32,110,0.18) 0%, rgba(255,32,110,0.05) 40%, transparent 70%)' }} />
        {/* Top-right warm red leak */}
        <div className="absolute top-[-8%] right-[-6%] w-125 h-125 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(180,30,60,0.25) 0%, transparent 70%)' }} />
        {/* Bottom-left deep purple leak */}
        <div className="absolute bottom-[-12%] left-[-8%] w-150 h-150 rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(100,20,120,0.20) 0%, transparent 70%)' }} />
        {/* Subtle peach warmth center-right */}
        <div className="absolute top-[55%] right-[10%] w-87.5 h-87.5 rounded-full opacity-40 animate-heat-drift"
          style={{ background: 'radial-gradient(circle, rgba(255,158,100,0.12) 0%, transparent 70%)', animationDelay: '-3s' }} />
      </div>

      {/* ===== NAV ===== */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5">
        <Link href="/" className="font-heading text-2xl sm:text-3xl tracking-tight text-at-text">
          AATMATRISHA
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/domains" className="hidden sm:inline font-inter text-[12px] tracking-wider uppercase text-at-text/40 hover:text-at-pink transition-colors duration-300">
            Domains
          </Link>
          {session ? (
            <ProfileDropdown name={session.name} srn={session.srn} role={session.role} />
          ) : (
            <Link href="/api/auth/pesu"
              className="btn-pill btn-pill-primary text-sm px-6 py-2.5">
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 sm:px-10 pt-16 pb-12 sm:pt-24 sm:pb-16" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <div className="relative max-w-2xl w-full text-center animate-fade-in-up">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-at-pink/20 bg-at-pink/5 backdrop-blur-sm mb-8 animate-fade-in-up-d1">
            <div className="w-2 h-2 rounded-full bg-at-pink animate-pulse" />
            <span className="font-inter text-[11px] font-medium tracking-[0.15em] uppercase text-at-pink">Now Recruiting — AT&apos;26</span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-at-text mb-2 animate-fade-in-up-d1">
            JOIN THE
          </h1>
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-6 animate-fade-in-up-d2">
            <span className="text-glow-pink text-gradient-heat">HEATWAVE</span>
          </h1>

          {/* Accent "heatwave" sticker — brush font */}
          <div className="animate-fade-in-up-d2 mb-8">
            <span className="font-accent text-at-peach/60 text-sm tracking-wider">est. 2026 · heatwave edition</span>
          </div>

          <p className="font-inter text-sm sm:text-base text-at-text/45 leading-relaxed mb-10 max-w-md mx-auto animate-fade-in-up-d2">
            Pick your domain, show up for the interview, and become part of something legendary.
          </p>

          {/* CTA — pill-shaped */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-d3">
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
              className="btn-pill btn-pill-primary text-lg px-10 py-4 inline-flex items-center gap-3"
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-14 animate-fade-in-up-d4">
            <div className="text-center">
              <p className="font-heading text-3xl text-at-text">14</p>
              <p className="font-inter text-[10px] text-at-text/25 uppercase tracking-wider font-medium">Domains</p>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div className="text-center">
              <p className="font-heading text-3xl text-at-pink">6 Max</p>
              <p className="font-inter text-[10px] text-at-text/25 uppercase tracking-wider font-medium">Applications</p>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div className="text-center">
              <p className="font-heading text-3xl text-at-peach">2026</p>
              <p className="font-inter text-[10px] text-at-text/25 uppercase tracking-wider font-medium">Edition</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="relative z-10 border-t border-b border-white/6 bg-white/2">
        <div className="overflow-hidden py-4">
          <div className="animate-marquee whitespace-nowrap flex">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-heading text-base tracking-[0.15em] text-at-text/15 mx-6">
                AATMATRISHA 2026 &bull; HEATWAVE &bull; {allDomains} &bull; APPLY NOW &bull;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorksSection />
    </main>
  );
}
