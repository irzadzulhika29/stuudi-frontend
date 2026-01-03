"use client";

import { useEffect, useState } from "react";

export default function RingOfFireLoader() {
  const [embers, setEmbers] = useState<
    { id: number; left: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    // Generate random embers on client side to avoid hydration mismatch
    // use setTimeout to avoid synchronous setState warning and ensure clean render cycle
    const timer = setTimeout(() => {
      setEmbers(
        Array.from({ length: 12 }).map((_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          duration: `${1 + Math.random() * 2}s`,
        }))
      );
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary-dark/95 backdrop-blur-sm">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Fire Effect SVG - Fixed Ring with Turbulent Texture */}
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <filter
              id="fire-static"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.1"
                numOctaves="5"
                seed="1"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="2s"
                  values="0.1;0.3;0.1"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="10" />
              <feGaussianBlur stdDeviation="1" />
            </filter>

            <linearGradient
              id="magma-gradient-fixed"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FFF700" /> {/* Yellow bottom */}
              <stop offset="60%" stopColor="#FF4500" /> {/* Orange middle */}
              <stop offset="100%" stopColor="#7A2E03" /> {/* Dark top */}
            </linearGradient>
          </defs>

          {/* Core Fixed Ring */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="transparent"
            stroke="url(#magma-gradient-fixed)"
            strokeWidth="4"
          />

          {/* Raging Fire Layer (Texture moves via SVG filter, ring stays fixed) */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="transparent"
            stroke="url(#magma-gradient-fixed)"
            strokeWidth="8"
            style={{
              filter: "url(#fire-static)",
              opacity: 1,
              mixBlendMode: "screen",
            }}
          />
        </svg>

        {/* Randomly Rising Embers (Bara Api) */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {embers.map((ember) => (
            <div
              key={ember.id}
              className="absolute bottom-0 w-1 h-1 bg-yellow-300 rounded-full blur-[0.5px] animate-fade-in-up"
              style={{
                left: ember.left,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Wild Outer Sparks */}
        <div className="absolute inset-[-20%]">
          {embers.slice(0, 5).map((ember) => (
            <div
              key={`outer-${ember.id}`}
              className="absolute bottom-1/4 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[1px] animate-float-gentle"
              style={{
                left: ember.left,
                animationDelay: ember.delay,
                animationDuration: `3s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-white/90 font-bold tracking-[0.3em] text-sm animate-pulse flex items-center gap-2">
        MEMUAT SISTEM...
      </div>
    </div>
  );
}
