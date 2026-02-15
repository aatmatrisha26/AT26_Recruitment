"use client";

import { HelpCircle } from "lucide-react";

interface HelpButtonProps {
  onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-3 bg-at-pink text-white rounded-full shadow-[0_4px_20px_rgba(255,51,120,0.3)] hover:bg-at-orange hover:shadow-[0_6px_30px_rgba(244,123,88,0.4)] transition-all duration-200 group"
      aria-label="Show tutorial"
    >
      <HelpCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-white/20 px-3 py-1.5 rounded-lg font-space text-xs text-white/90 tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Need Help?
      </span>
    </button>
  );
}
