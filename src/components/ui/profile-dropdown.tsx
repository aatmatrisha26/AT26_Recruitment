// src/components/ui/profile-dropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";

interface ProfileDropdownProps {
    name: string;
    srn: string;
    role: string;
}

export function ProfileDropdown({ name, srn, role }: ProfileDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayRole = role === 'superadmin' ? 'Super Admin'
        : role.startsWith('CO_') ? `CO – ${role.replace('CO_', '').charAt(0) + role.replace('CO_', '').slice(1).toLowerCase()}`
            : 'Student';

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-space" style={{ background: 'linear-gradient(135deg, #FF3378, #F47B58)' }}>
                    {initials || <User className="w-4 h-4" />}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#161b22] shadow-2xl p-1 z-[100]">
                    <div className="px-3 py-3 border-b border-white/5">
                        <p className="font-space text-sm font-bold text-white truncate">{name}</p>
                        <p className="font-space text-[11px] text-white/40 mt-0.5">{srn}</p>
                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-space tracking-wider" style={{
                            background: role === 'superadmin' ? 'rgba(244,123,88,0.2)' : role.startsWith('CO_') ? 'rgba(78,205,196,0.2)' : 'rgba(255,51,120,0.2)',
                            color: role === 'superadmin' ? '#F47B58' : role.startsWith('CO_') ? '#4ECDC4' : '#FF3378',
                            border: `1px solid ${role === 'superadmin' ? 'rgba(244,123,88,0.3)' : role.startsWith('CO_') ? 'rgba(78,205,196,0.3)' : 'rgba(255,51,120,0.3)'}`,
                        }}>
                            {displayRole}
                        </div>
                    </div>
                    {role === 'superadmin' ? (
                        <Link href="/admin/overview" className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-inter" onClick={() => setOpen(false)}>
                            Admin Panel
                        </Link>
                    ) : role.startsWith('CO_') ? (
                        <Link href="/co" className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-inter" onClick={() => setOpen(false)}>
                            CO Dashboard
                        </Link>
                    ) : (
                        <Link href="/domains" className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-inter" onClick={() => setOpen(false)}>
                            Dashboard
                        </Link>
                    )}
                    <button
                        onClick={() => { window.location.href = '/api/auth/logout'; }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors font-inter w-full"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export function SidebarProfile({ name, srn, role, expanded }: ProfileDropdownProps & { expanded: boolean }) {
    const displayRole = role === 'superadmin' ? 'Super Admin'
        : role.startsWith('CO_') ? `CO – ${role.replace('CO_', '').charAt(0) + role.replace('CO_', '').slice(1).toLowerCase()}`
            : 'Student';

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-space shrink-0" style={{ background: 'linear-gradient(135deg, #FF3378, #F47B58)' }}>
                {initials || <User className="w-4 h-4" />}
            </div>
            {expanded && (
                <div className="min-w-0">
                    <p className="font-space text-xs font-bold text-white truncate">{name}</p>
                    <p className="font-space text-[9px] text-white/30 truncate">{srn} · {displayRole}</p>
                </div>
            )}
        </div>
    );
}