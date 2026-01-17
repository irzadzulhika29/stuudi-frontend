"use client";

import React from "react";
import "./styles/progress-bar.css";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const stepLabels = ["Email", "OTP", "Profil", "Sekolah"];

export default function ProgressBar({
  currentStep,
  totalSteps = 4,
}: ProgressBarProps) {
  return (
    <div className="w-full max-w-sm mx-auto my-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isLast = stepNum === totalSteps;

          return (
            <div
              key={stepNum}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                {/* Fire Ring Effect for Current Step - Adapted from RingOfFireLoader */}
                {isCurrent && (
                  <div className="absolute inset-0 w-14 h-14 -m-3 max-w-none z-0">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full overflow-visible opacity-90"
                    >
                      <defs>
                        <filter
                          id={`fire-static-step-${stepNum}`}
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                        >
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.1"
                            numOctaves="5"
                            seed={stepNum}
                          >
                            <animate
                              attributeName="baseFrequency"
                              dur="2s"
                              values="0.1;0.3;0.1"
                              repeatCount="indefinite"
                            />
                          </feTurbulence>
                          <feDisplacementMap in="SourceGraphic" scale="25" />
                          <feGaussianBlur stdDeviation="1.5" />
                        </filter>

                        <linearGradient
                          id={`magma-gradient-step-${stepNum}`}
                          x1="0%"
                          y1="100%"
                          x2="0%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#FFF700" />
                          <stop offset="60%" stopColor="#FF4500" />
                          <stop offset="100%" stopColor="#7A2E03" />
                        </linearGradient>
                      </defs>

                      {/* Core Fixed Ring */}
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="transparent"
                        stroke={`url(#magma-gradient-step-${stepNum})`}
                        strokeWidth="4"
                      />

                      {/* Raging Fire Layer - Inner Base */}
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="transparent"
                        stroke={`url(#magma-gradient-step-${stepNum})`}
                        strokeWidth="8"
                        style={{
                          filter: `url(#fire-static-step-${stepNum})`,
                          opacity: 0.8,
                          mixBlendMode: "screen",
                        }}
                      />

                      {/* Wild Outer Flames - "Mencuat" Effect */}
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="transparent"
                        stroke={`url(#magma-gradient-step-${stepNum})`}
                        strokeWidth="12"
                        strokeDasharray="20 10"
                        style={{
                          filter: `url(#fire-static-step-${stepNum})`,
                          opacity: 0.6,
                          mixBlendMode: "screen",
                          transformOrigin: "center",
                          animation: "spin-slow 4s linear infinite",
                        }}
                      />
                    </svg>
                  </div>
                )}

                {/* Circle */}
                <div
                  className={`
                    relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10
                    transition-all duration-300 
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-secondary to-secondary-light text-white shadow-md shadow-secondary/50"
                        : isCurrent
                          ? "bg-white text-secondary border-2 border-secondary shadow-lg shadow-orange-500/20"
                          : "bg-white border-2 border-gray-200 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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

                {/* Label */}
                <span
                  className={`
                    mt-2 text-[10px] font-medium transition-colors duration-300 relative z-10
                    ${
                      isCompleted || isCurrent
                        ? "text-secondary"
                        : "text-gray-400"
                    }
                  `}
                >
                  {stepLabels[i]}
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-[3px] mx-1 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-500
                      ${
                        isCompleted
                          ? "w-full bg-gradient-to-r from-secondary to-secondary-light"
                          : "w-0"
                      }
                    `}
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
