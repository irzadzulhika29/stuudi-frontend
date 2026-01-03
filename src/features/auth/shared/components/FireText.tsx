"use client";

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

      <span className="relative z-10 fire-core-text">{text}</span>

      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="fire-wind" x="-20%" y="-50%" width="140%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.08"
              numOctaves="3"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02 0.08; 0.02 0.12; 0.02 0.08"
                dur="2s"
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
