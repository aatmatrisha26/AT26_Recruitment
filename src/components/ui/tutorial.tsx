"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export interface TutorialStep {
  title: string;
  description: string;
}

interface TutorialProps {
  pageKey: string; // Unique key for sessionStorage
  steps: TutorialStep[];
  onClose?: () => void;
  forceShow?: boolean; // For help button trigger
}

export default function Tutorial({ pageKey, steps, onClose, forceShow = false }: TutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has skipped this tutorial
    const hasSkipped = sessionStorage.getItem(`tutorial_skip_${pageKey}`);
    if (!hasSkipped || forceShow) {
      setIsVisible(true);
    }
  }, [pageKey, forceShow]);

  const handleSkip = () => {
    sessionStorage.setItem(`tutorial_skip_${pageKey}`, "true");
    setIsVisible(false);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSkip();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible || steps.length === 0) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0d1117] border border-white/20 rounded-xl max-w-md w-full p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Close tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step counter */}
        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-at-pink"
                  : index < currentStep
                  ? "bg-at-teal"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="font-heading text-xl text-white tracking-wider uppercase mb-3">
            {step.title}
          </h3>
          <p className="font-inter text-sm text-white/70 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="font-space text-xs text-white/40 hover:text-white/60 uppercase tracking-wider transition-colors"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-at-pink text-white font-heading text-sm tracking-wider rounded-lg hover:bg-at-orange transition-colors shadow-[0_0_20px_rgba(255,51,120,0.2)]"
            >
              {currentStep < steps.length - 1 ? "Next" : "Got it"}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step indicator text */}
        <div className="text-center mt-4">
          <span className="font-space text-[10px] text-white/30 tracking-wider">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
