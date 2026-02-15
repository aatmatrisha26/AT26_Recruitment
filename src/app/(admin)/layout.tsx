"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { BarChart3, Users2, Upload, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { label: "Overview", href: "/admin/overview", icon: <BarChart3 className="text-white/60 h-5 w-5 shrink-0" /> },
        { label: "Multi-Domain", href: "/admin/multi-domain", icon: <Users2 className="text-white/60 h-5 w-5 shrink-0" /> },
        { label: "Upload & Publish", href: "/admin/upload", icon: <Upload className="text-white/60 h-5 w-5 shrink-0" /> },
    ];

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
                        <SidebarLink link={{ label: "Logout", href: "/api/auth/logout", icon: <LogOut className="text-white/30 h-5 w-5 shrink-0" /> }} />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-auto"><div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">{children}</div></main>
        </div>
    );
}
