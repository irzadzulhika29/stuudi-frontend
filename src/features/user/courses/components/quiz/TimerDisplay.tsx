"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimerDisplayProps {
  startTime: number;
  /** Optional: If quiz has a time limit in minutes */
  timeLimitMinutes?: number;
}

export function TimerDisplay({ startTime, timeLimitMinutes }: TimerDisplayProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  // Determine time state for visual feedback
  const timeState = useMemo(() => {
    const minutes = elapsedTime / 60;
    if (timeLimitMinutes) {
      const remaining = timeLimitMinutes - minutes;
      if (remaining <= 1) return "critical"; // Last minute
      if (remaining <= 5) return "warning"; // Last 5 minutes
    }
    // For elapsed time without limit
    if (minutes >= 30) return "long";
    if (minutes >= 15) return "medium";
    return "normal";
  }, [elapsedTime, timeLimitMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${centisecs.toString().padStart(2, "0")}`;
  };

  // Dynamic colors based on time state
  const getColors = () => {
    switch (timeState) {
      case "critical":
        return {
          border: "border-red-500/50",
          bg: "bg-red-500/20",
          icon: "text-red-400",
          text: "text-red-300",
        };
      case "warning":
        return {
          border: "border-orange-500/50",
          bg: "bg-orange-500/20",
          icon: "text-orange-400",
          text: "text-orange-300",
        };
      case "long":
        return {
          border: "border-yellow-500/30",
          bg: "bg-yellow-500/10",
          icon: "text-yellow-400",
          text: "text-white",
        };
      default:
        return {
          border: "border-white/10",
          bg: "bg-white/10",
          icon: "text-orange-300",
          text: "text-white",
        };
    }
  };

  const colors = getColors();
  const shouldPulse = timeState === "critical" || timeState === "warning";

  return (
    <motion.div
      className={`flex items-center gap-3 rounded-xl border ${colors.border} ${colors.bg} px-4 py-2 backdrop-blur-md transition-colors duration-300`}
      animate={shouldPulse ? { scale: [1, 1.02, 1] } : {}}
      transition={shouldPulse ? { repeat: Infinity, duration: 1 } : {}}
    >
      <motion.div
        animate={shouldPulse ? { opacity: [1, 0.5, 1] } : {}}
        transition={shouldPulse ? { repeat: Infinity, duration: 0.5 } : {}}
      >
        <Clock size={18} className={colors.icon} />
      </motion.div>
      <span className={`font-mono text-xl font-bold tracking-widest ${colors.text}`}>
        {formatTime(elapsedTime)}
      </span>
    </motion.div>
  );
}
