"use client";

import React from "react";
import "./styles/progress-bar.css";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const stepLabels = ["Email", "OTP", "Profil", "Sekolah"];

export default function ProgressBar({ currentStep, totalSteps = 4 }: ProgressBarProps) {
  return (
    <div className="mx-auto my-6 w-full max-w-sm">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isLast = stepNum === totalSteps;

          return (
            <div key={stepNum} className="flex flex-1 items-center last:flex-none">
              <div className="relative flex flex-col items-center">
                {isCurrent && (
                  <div className="border-secondary absolute inset-0 z-0 -m-1 animate-pulse rounded-full border-2 opacity-50" />
                )}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "from-secondary to-secondary-light shadow-secondary/50 bg-gradient-to-br text-white shadow-md"
                      : isCurrent
                        ? "text-secondary border-secondary border-2 bg-white shadow-lg shadow-orange-500/20"
                        : "border-2 border-gray-200 bg-white text-gray-400"
                  } `}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>

                <span
                  className={`relative z-10 mt-2 text-[10px] font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent ? "text-secondary" : "text-gray-400"
                  } `}
                >
                  {stepLabels[i]}
                </span>
              </div>

              {!isLast && (
                <div className="mx-1 h-[3px] flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? "from-secondary to-secondary-light w-full bg-gradient-to-r"
                        : "w-0"
                    } `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
