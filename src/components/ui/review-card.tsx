"use client";

import * as React from "react";
import { Star, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
    name: string;
    handle: string;
    review: string;
    rating: number;
    className?: string;
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
    ({ name, handle, review, rating, className }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-xl p-6 shadow-xl w-full max-w-md border border-white/10",
                    className
                )}
                style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                role="article"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #FF3378, #F47B58)' }}>
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-heading text-lg text-white tracking-wider">{name}</h3>
                            <p className="font-space text-xs text-white/40">{handle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/20")} />
                        ))}
                    </div>
                </div>

                <p className="mt-4 font-inter text-sm text-white/60 leading-relaxed">{review}</p>
            </motion.div>
        );
    }
);

ReviewCard.displayName = "ReviewCard";

/** Modal wrapper that shows a ReviewCard as an overlay */
export function ReviewCardModal({
    open,
    onClose,
    ...cardProps
}: ReviewCardProps & { open: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    {/* Card */}
                    <div className="relative z-10">
                        <button onClick={onClose} className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                        <ReviewCard {...cardProps} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export { ReviewCard };
