"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning";
}

export function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger"
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative z-50 w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl"
                    >
                        <div className="p-6 text-center">
                            <div className={cn("mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500", variant === "warning" && "bg-yellow-500/10 text-yellow-500")}>
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-heading text-white">{title}</h3>
                            <p className="mb-6 text-sm text-white/60 font-inter">{description}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 font-inter"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={cn("flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors font-inter", variant === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600")}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-sm text-white/40 opacity-70 transition-opacity hover:opacity-100 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
