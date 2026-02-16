
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { SidebarProfile } from "@/components/ui/profile-dropdown";
import { LayoutGrid, ClipboardList, CheckCircle, LogOut, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function getSessionFromCookie(): { name: string; srn: string; email?: string; role: string } | null {
    try {
        const cookieString = document.cookie;

        const cookies = cookieString.split(';');
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

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [session, setSession] = useState<{ name: string; srn: string; role: string } | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const parsed = getSessionFromCookie();
        if (parsed) {
            setSession(parsed);
        }
        setChecked(true);
    }, []);

    const links = [
        { label: "Domains", href: "/domains", icon: <LayoutGrid className="text-at-pink h-5 w-5 shrink-0" /> },
        { label: "Register", href: "/register", icon: <ClipboardList className="text-at-cyan h-5 w-5 shrink-0" /> },
        { label: "Status", href: "/status", icon: <CheckCircle className="text-at-peach h-5 w-5 shrink-0" /> },
    ];

    const protectedRoutes = ['/register', '/status'];
    const isProtectedRoute = protectedRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));

    if (!checked && isProtectedRoute) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-at-void">
                <div className="w-8 h-8 border-2 border-at-pink/30 border-t-at-pink rounded-full animate-spin" />
            </div>
        );
    }

    if (checked && !session && isProtectedRoute) {

        return <AuthRedirect pathname={pathname} />;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-at-void">
            <Sidebar open={true} setOpen={() => { }}>
                <SidebarBody className="justify-between gap-4 h-full" style={{ background: 'linear-gradient(180deg, #0A0A0C 0%, #111113 100%)' }}>
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {}
                        <Link href="/" className="flex items-center gap-3 py-3 mb-4 px-1 group">
                            <Image src="/AT26_logo.png" alt="AT'26" width={40} height={40} className="rounded-xl shrink-0 shadow-lg group-hover:shadow-[0_0_15px_rgba(255,32,110,0.2)] transition-shadow duration-300" />
                            <div className="whitespace-pre">
                                <span className="font-heading text-at-text text-sm tracking-tight group-hover:text-gradient-heat transition-all duration-300">AATMATRISHA</span>
                                <span className="font-retro text-[7px] text-at-text/15 block tracking-[0.15em]">2026 RECRUITMENTS</span>
                            </div>
                        </Link>

                        {}
                        <div className="mb-2 px-3">
                            <span className="font-retro text-[7px] sm:text-[8px] text-at-text/15 tracking-[0.25em]">MENU</span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} active={pathname === link.href} />
                            ))}
                        </div>

                        {}
                        <div className="mt-6 mb-2 px-3">
                            <span className="font-retro text-[7px] sm:text-[8px] text-at-text/15 tracking-[0.25em]">LINKS</span>
                        </div>
                        <SidebarLink link={{ label: "Home", href: "/", icon: <Home className="text-white/20 h-5 w-5 shrink-0" /> }} />
                    </div>

                    {}
                    <div className="border-t border-white/5 pt-3 space-y-2">
                        {session && (
                            <div className="px-2 py-1">
                                <SidebarProfile name={session.name} srn={session.srn} role={session.role} expanded={true} />
                            </div>
                        )}
                        {
}
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
                <div className="p-3 sm:p-5 md:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

function AuthRedirect({ pathname }: { pathname: string }) {
    useEffect(() => {
        window.location.href = '/api/auth/pesu?returnUrl=' + encodeURIComponent(pathname);
    }, [pathname]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-at-void">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-at-pink/30 border-t-at-pink rounded-full animate-spin mx-auto mb-4" />
                <p className="font-retro text-[10px] text-at-text/30 tracking-widest">REDIRECTING TO LOGIN...</p>
            </div>
        </div>
    );
}
