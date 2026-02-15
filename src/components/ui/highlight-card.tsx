"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const colorThemes = {
    pink: {
        from: "339 100% 60%",
        to: "350 90% 50%",
        foreground: "0 0% 100%",
    },
    orange: {
        from: "16 89% 59%",
        to: "24 85% 52%",
        foreground: "0 0% 100%",
    },
    teal: {
        from: "174 56% 55%",
        to: "170 50% 45%",
        foreground: "0 0% 100%",
    },
    white: {
        from: "220 20% 25%",
        to: "230 25% 18%",
        foreground: "0 0% 100%",
    },
};

export interface HighlightCardProps {
    title: string;
    description: string;
    metricValue: string;
    metricLabel: string;
    buttonText: string;
    onButtonClick: () => void;
    icon: React.ReactNode;
    color?: keyof typeof colorThemes;
    className?: string;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export const HighlightCard = React.forwardRef<HTMLDivElement, HighlightCardProps>(
    ({ title, description, metricValue, metricLabel, buttonText, onButtonClick, icon, color = "pink", className }, ref) => {
        const theme = colorThemes[color] || colorThemes.pink;

        return (
            <motion.div
                ref={ref}
                className={cn("relative w-full overflow-hidden rounded-2xl p-6 shadow-lg cursor-pointer", className)}
                style={{
                    '--card-from-color': `hsl(${theme.from})`,
                    '--card-to-color': `hsl(${theme.to})`,
                    '--card-foreground-color': `hsl(${theme.foreground})`,
                    color: `hsl(${theme.foreground})`,
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, hsla(0,0%,100%,0.12) 1px, transparent 0),
            linear-gradient(to bottom right, hsl(${theme.from}), hsl(${theme.to}))
          `,
                    backgroundSize: "0.5rem 0.5rem, 100% 100%",
                } as React.CSSProperties}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
                {/* Bookmark */}
                <div className="absolute top-0 right-6 h-16 w-12 bg-white/90 backdrop-blur-sm [clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_50%_75%,_0%_100%)]">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                </div>

                <div className="flex h-full flex-col justify-between min-h-[160px]">
                    <div>
                        <motion.h3 variants={itemVariants} className="font-heading text-2xl tracking-wider">{title}</motion.h3>
                        <motion.p variants={itemVariants} className="mt-1 font-inter text-sm opacity-85 max-w-[80%] leading-relaxed">{description}</motion.p>
                    </div>

                    <motion.div variants={itemVariants} className="my-4 h-px w-full bg-white/20" />

                    <div className="flex items-end justify-between">
                        <motion.div variants={itemVariants}>
                            <p className="font-heading text-xl tracking-wider opacity-90">{metricValue}</p>
                            <p className="font-space text-xs opacity-70">{metricLabel}</p>
                        </motion.div>
                        <motion.button
                            variants={itemVariants}
                            onClick={(e) => { e.stopPropagation(); onButtonClick(); }}
                            className="rounded-full bg-white/25 px-4 py-2 text-sm font-semibold font-space backdrop-blur-sm transition-colors hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        >
                            {buttonText}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }
);

HighlightCard.displayName = "HighlightCard";
