"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState, useId } from "react";

function CountingNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 1500 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return <span ref={ref}>{displayValue}</span>;
}

interface CircularProgressProps {
  progress: number;
  /** Size variant - small for compact views, default for full cards */
  size?: "small" | "default";
}

/**
 * Animated circular progress indicator with glow effect.
 * Changes color based on progress: yellow (0-49), orange (50-99), green (100).
 */
export function CircularProgress({ progress, size = "default" }: CircularProgressProps) {
  const radius = size === "small" ? 12 : 20;
  const svgSize = size === "small" ? 32 : 52;
  const strokeWidth = size === "small" ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const filterId = useId().replace(/:/g, "");

  const getProgressColor = () => {
    if (progress >= 100) return "#22C55E";
    if (progress >= 50) return "#F97316";
    return "#EAB308";
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={`glow-${filterId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="-rotate-90 transform"
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ filter: `url(#glow-${filterId})` }}
        />
      </svg>
      <span
        className={`absolute flex items-center justify-center font-bold text-white ${size === "small" ? "text-[9px]" : "pt-0.5 text-[11px]"}`}
      >
        <CountingNumber value={progress} />%
      </span>
    </div>
  );
}
