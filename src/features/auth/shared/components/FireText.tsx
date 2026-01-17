"use client";

import "@/features/auth/shared/styles/fire-text.css";

interface FireTextProps {
  text: string;
  className?: string;
}

export default function FireText({ text, className = "" }: FireTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className="absolute inset-0 z-0 text-transparent fire-distort-layer select-none"
        data-text={text}
        aria-hidden="true"
      >
        {text}
      </span>

      <span className="relative z-10 text-primary-light">{text}</span>

      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="fire-wind" x="-20%" y="-50%" width="140%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03 0.1"
              numOctaves="4"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.03 0.1; 0.04 0.15; 0.03 0.1"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />

            <feGaussianBlur in="distorted" stdDeviation="1" result="blurred" />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
