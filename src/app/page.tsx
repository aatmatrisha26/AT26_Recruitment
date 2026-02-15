import Link from "next/link";
import { getSessionFromCookie } from "@/lib/auth";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { DOMAINS_DATA } from "@/lib/domains";
import { HOW_IT_WORKS_STEPS } from "@/lib/steps";

export default async function LandingPage() {
  const session = await getSessionFromCookie();

  const allDomains = DOMAINS_DATA.map(d => d.name.toUpperCase()).join(" \u2022 ");

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 30%, #1a1a2e 60%, #0f3460 100%)' }}>
      {/* Ambient background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FF3378 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #4ECDC4 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F47B58 0%, transparent 70%)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* ===== NAV ===== */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5">
        <Link href="/" className="font-heading text-2xl sm:text-3xl tracking-wider text-white">
          AATMATRISHA
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/domains" className="hidden sm:inline font-space text-[11px] tracking-widest uppercase text-white/40 hover:text-at-teal transition-colors">
            Domains
          </Link>
          {session ? (
            <ProfileDropdown name={session.name} srn={session.srn} role={session.role} />
          ) : (
            <Link href="/api/auth/pesu"
              className="font-heading tracking-wider text-sm px-6 py-2.5 bg-at-pink text-white hover:bg-at-orange transition-colors duration-200 rounded-lg">
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 sm:px-10 pt-16 pb-12 sm:pt-24 sm:pb-16" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <div className="relative max-w-2xl w-full text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-at-teal/30 bg-at-teal/10 mb-8 animate-fade-in-up-d1">
            <div className="w-1.5 h-1.5 rounded-full bg-at-teal animate-pulse" />
            <span className="font-space text-[11px] tracking-[0.15em] uppercase text-at-teal">Now Recruiting — AT&apos;26</span>
          </div>

          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-white mb-6 animate-fade-in-up-d1">
            JOIN THE<br />
            <span className="text-at-pink" style={{ textShadow: '0 0 60px rgba(255,51,120,0.3)' }}>HEATWAVE</span>
          </h1>

          <p className="font-inter text-sm sm:text-base text-white/50 leading-relaxed mb-10 max-w-md mx-auto animate-fade-in-up-d2">
            Pick your domain, show up for the interview, and become part of something legendary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-d3">
            <Link
              href={session ? "/domains" : "/api/auth/pesu"}
              className="font-heading tracking-wider text-lg px-10 py-4 bg-at-pink text-white hover:bg-at-orange transition-all duration-200 inline-flex items-center gap-3 rounded-lg shadow-[0_0_30px_rgba(255,51,120,0.3)] hover:shadow-[0_0_40px_rgba(244,123,88,0.4)]"
            >
              {session ? "Go to Dashboard" : "Join Recruitments"}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in-up-d3">
            <div className="text-center">
              <p className="font-heading text-3xl text-at-teal">14</p>
              <p className="font-space text-[10px] text-white/30 uppercase tracking-wider">Domains</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-heading text-3xl text-at-pink">6 Max</p>
              <p className="font-space text-[10px] text-white/30 uppercase tracking-wider">Applications</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-heading text-3xl text-at-orange">2026</p>
              <p className="font-space text-[10px] text-white/30 uppercase tracking-wider">Edition</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE — right after hero ===== */}
      <div className="relative z-10 border-t border-b border-white/10 bg-white/[0.03]">
        <div className="overflow-hidden py-4">
          <div className="animate-marquee whitespace-nowrap flex">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-heading text-base tracking-[0.2em] text-white/30 mx-6">
                AATMATRISHA 2026 &bull; HEATWAVE &bull; {allDomains} &bull; APPLY NOW &bull;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 px-6 sm:px-10 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-at-orange/30 bg-at-orange/10 mb-5">
            <span className="font-space text-[11px] tracking-[0.15em] uppercase text-at-orange">5 Simple Steps</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wider">HOW IT WORKS</h2>
          <p className="font-inter text-sm text-white/40 mt-3 max-w-md mx-auto">From login to results — here&apos;s everything you need to know.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={i} className="relative group">
              {i < 4 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+2px)] w-[calc(100%-16px)] h-px bg-white/10 -translate-x-1/2 z-0" />
              )}
              <div className="relative bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors duration-200 h-full">
                <div className="font-heading text-3xl mb-3" style={{ color: step.color, opacity: 0.8 }}>{step.num}</div>
                <h3 className="font-heading text-lg text-white tracking-wider mb-2">{step.title}</h3>
                <p className="font-inter text-xs text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
