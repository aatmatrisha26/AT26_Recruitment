
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { BarChart3, Users2, Upload, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const [session, setSession] = useState<{ name: string; srn: string; role: string } | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const parsed = getSessionFromCookie();
        if (parsed) setSession(parsed);
        setChecked(true);
    }, []);

    const links = [
        { label: "Overview", href: "/admin/overview", icon: <BarChart3 className="text-white/60 h-5 w-5 shrink-0" /> },
        { label: "Multi-Domain", href: "/admin/multi-domain", icon: <Users2 className="text-white/60 h-5 w-5 shrink-0" /> },
        { label: "Upload & Publish", href: "/admin/upload", icon: <Upload className="text-white/60 h-5 w-5 shrink-0" /> },
    ];

    if (!checked) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
                <div className="w-8 h-8 border-2 border-at-orange/30 border-t-at-orange rounded-full animate-spin" />
            </div>
        );
    }

    if (checked && !session) {
        return <AuthRedirect pathname={pathname} />;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen" style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #1a1a2e 100%)' }}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-6">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <Link href="/" className="flex items-center gap-2 py-1 mb-4">
                            <div className="h-9 w-9 bg-at-orange rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs font-anton">
                                SA
                            </div>
                            <motion.span animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
                                className="font-anton text-white text-lg tracking-tight whitespace-pre">SUPERADMIN</motion.span>
                        </Link>
                        <div className="flex flex-col gap-1">
                            {links.map((link, idx) => <SidebarLink key={idx} link={link} active={pathname === link.href} />)}
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                        <button
                            onClick={() => { window.location.href = '/api/auth/logout'; }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
                        >
                            <LogOut className="text-white/30 h-5 w-5 shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-auto"><div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">{children}</div></main>
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
                <div className="w-8 h-8 border-2 border-at-orange/30 border-t-at-orange rounded-full animate-spin mx-auto mb-4" />
                <p className="font-retro text-[10px] text-white/30 tracking-widest">REDIRECTING TO LOGIN...</p>
            </div>
        </div>
    );
}
