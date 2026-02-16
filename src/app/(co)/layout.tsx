
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { SidebarProfile } from "@/components/ui/profile-dropdown";
import { LayoutGrid, Users, Trophy, LogOut, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function getSessionFromCookie(): { name: string; srn: string; email?: string; role: string } | null {
    try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [key, ...valueParts] = cookie.trim().split('=');
            if (key.trim() === 'at26_session') {
                const rawValue = valueParts.join('=');
                let decoded: string;
                try {
                    decoded = decodeURIComponent(rawValue);
                } catch {
                    decoded = rawValue;
                }
                return JSON.parse(decoded);
            }
        }
        return null;
    } catch {
        return null;
    }
}

export default function COLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [session, setSession] = useState<{ name: string; srn: string; role: string } | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const parsed = getSessionFromCookie();
        if (parsed) setSession(parsed);
        setChecked(true);
    }, []);

    const domainLabel = session?.role
        ? session.role.replace('CO_', '').charAt(0) + session.role.replace('CO_', '').slice(1).toLowerCase()
        : 'Domain';

    const links = [
        { label: "Dashboard", href: "/co", icon: <LayoutGrid className="text-at-teal h-5 w-5 shrink-0" /> },
        { label: "Recruitments", href: "/co/recruitments", icon: <Users className="text-at-pink h-5 w-5 shrink-0" /> },
        { label: "Leaderboard", href: "/co/leaderboard", icon: <Trophy className="text-at-orange h-5 w-5 shrink-0" /> },
    ];

    if (!checked) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
                <div className="w-8 h-8 border-2 border-at-teal/30 border-t-at-teal rounded-full animate-spin" />
            </div>
        );
    }

    if (checked && !session) {
        return <AuthRedirect pathname={pathname} />;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
            <Sidebar open={true} setOpen={() => { }}>
                <SidebarBody className="justify-between gap-4 h-full" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)' }}>
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {}
                        <Link href="/co" className="flex items-center gap-3 py-3 mb-4 px-1">
                            <Image src="/AT26_logo.png" alt="AT'26" width={40} height={40} className="rounded-xl shrink-0 shadow-lg" />
                            <div className="whitespace-pre">
                                <span className="font-heading text-white text-xl tracking-wider">CO PANEL</span>
                                <span className="font-space text-[9px] text-at-teal block tracking-wider uppercase">{domainLabel}</span>
                            </div>
                        </Link>

                        {}
                        <div className="mb-2 px-3">
                            <span className="font-space text-[9px] text-white/20 uppercase tracking-[0.2em]">Menu</span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} active={pathname === link.href} />
                            ))}
                        </div>

                        {}
                        <div className="mt-6 mb-2 px-3">
                            <span className="font-space text-[9px] text-white/20 uppercase tracking-[0.2em]">Quick Links</span>
                        </div>
                        <SidebarLink link={{ label: "Home", href: "/", icon: <Home className="text-white/30 h-5 w-5 shrink-0" /> }} />
                    </div>

                    {}
                    <div className="border-t border-white/5 pt-3 space-y-2">
                        {session && (
                            <div className="px-2 py-1">
                                <SidebarProfile name={session.name} srn={session.srn} role={session.role} expanded={true} />
                            </div>
                        )}
                        <button
                            onClick={() => { window.location.href = '/api/auth/logout'; }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
                        >
                            <LogOut className="text-red-400/40 h-5 w-5 shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

function AuthRedirect({ pathname }: { pathname: string }) {
    useEffect(() => {
        window.location.href = '/api/auth/pesu?returnUrl=' + encodeURIComponent(pathname);
    }, [pathname]);

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-at-teal/30 border-t-at-teal rounded-full animate-spin mx-auto mb-4" />
                <p className="font-retro text-[10px] text-white/30 tracking-widest">REDIRECTING TO LOGIN...</p>
            </div>
        </div>
    );
}
