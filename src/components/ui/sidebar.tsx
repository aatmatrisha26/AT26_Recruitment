"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
    return context;
};

export const SidebarProvider = ({
    children, open: openProp, setOpen: setOpenProp, animate = true,
}: {
    children: React.ReactNode; open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);
    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
    return <SidebarContext.Provider value={{ open, setOpen, animate }}>{children}</SidebarContext.Provider>;
};

export const Sidebar = ({ children, open, setOpen, animate }: {
    children: React.ReactNode; open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean;
}) => <SidebarProvider open={open} setOpen={setOpen} animate={animate}>{children}</SidebarProvider>;

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
    <>
        <DesktopSidebar {...props} />
        <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
);

export const DesktopSidebar = ({ className, children, ...props }: React.ComponentProps<typeof motion.div>) => {
    return (
        <motion.div
            className={cn("min-h-screen sticky top-0 px-4 py-4 hidden md:flex md:flex-col bg-at-dark w-[260px] shrink-0 border-r border-white/10", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<"div">) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <>
            <div className="h-14 px-4 flex md:hidden items-center justify-between bg-at-dark w-full border-b border-white/10" {...props}>
                <div className="flex items-center gap-3 z-20">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-at-pink/20">
                        <Image
                            src="/AT26_logo.png"
                            alt="AT26"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-heading font-bold text-white text-lg tracking-wider">AATMATRISHA</span>
                </div>
                <div className="flex justify-end z-20">
                    <Menu className="text-white cursor-pointer" onClick={() => setMobileOpen(true)} />
                </div>
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={cn("fixed h-full w-full inset-0 bg-at-dark p-10 z-[100] flex flex-col justify-between", className)}
                        >
                            <div className="absolute right-10 top-10 z-50 text-white cursor-pointer" onClick={() => setMobileOpen(false)}>
                                <X />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({ link, className, active, ...props }: {
    link: Links; className?: string; active?: boolean; props?: LinkProps;
}) => {
    return (
        <Link
            href={link.href}
            className={cn(
                "flex items-center justify-start gap-3 py-3 px-3 rounded-lg transition-all font-inter text-sm",
                active ? "bg-at-pink text-white font-semibold" : "text-white/50 hover:text-white hover:bg-white/5",
                className
            )}
            {...props}
        >
            {link.icon}
            <span className="whitespace-pre inline-block">{link.label}</span>
        </Link>
    );
};
