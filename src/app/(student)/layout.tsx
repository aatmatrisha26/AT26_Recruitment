"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { SidebarProfile } from "@/components/ui/profile-dropdown";
import { LayoutGrid, ClipboardList, CheckCircle, LogOut, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [session, setSession] = useState<{ name: string; srn: string; role: string } | null>(null);

    useEffect(() => {
        try {
            const match = document.cookie.match(/at26_session=([^;]+)/);
            if (match) setSession(JSON.parse(decodeURIComponent(match[1])));
        } catch { /* no session */ }
    }, []);

    const links = [
        { label: "Domains", href: "/domains", icon: <LayoutGrid className="text-at-teal h-5 w-5 shrink-0" /> },
        { label: "Register", href: "/register", icon: <ClipboardList className="text-at-pink h-5 w-5 shrink-0" /> },
        { label: "Status", href: "/status", icon: <CheckCircle className="text-at-orange h-5 w-5 shrink-0" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
            <Sidebar open={true} setOpen={() => { }}>
                <SidebarBody className="justify-between gap-4 h-full" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)' }}>
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 py-3 mb-4 px-1">
                            <Image src="/AT26_logo.png" alt="AT'26" width={40} height={40} className="rounded-xl shrink-0 shadow-lg" />
                            <div className="whitespace-pre">
                                <span className="font-heading text-white text-xl tracking-wider">AATMATRISHA</span>
                                <span className="font-space text-[9px] text-white/30 block tracking-wider">2026 RECRUITMENTS</span>
                            </div>
                        </Link>

                        {/* Nav section */}
                        <div className="mb-2 px-3">
                            <span className="font-space text-[9px] text-white/20 uppercase tracking-[0.2em]">Menu</span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} active={pathname === link.href} />
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="mt-6 mb-2 px-3">
                            <span className="font-space text-[9px] text-white/20 uppercase tracking-[0.2em]">Quick Links</span>
                        </div>
                        <SidebarLink link={{ label: "Home", href: "/", icon: <Home className="text-white/30 h-5 w-5 shrink-0" /> }} />
                    </div>

                    {/* Profile + Logout at bottom */}
                    <div className="border-t border-white/5 pt-3 space-y-2">
                        {session && (
                            <div className="px-2 py-1">
                                <SidebarProfile name={session.name} srn={session.srn} role={session.role} expanded={true} />
                            </div>
                        )}
                        <SidebarLink link={{ label: "Logout", href: "/api/auth/logout", icon: <LogOut className="text-red-400/40 h-5 w-5 shrink-0" /> }} />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
