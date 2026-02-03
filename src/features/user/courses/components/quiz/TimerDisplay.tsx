"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerDisplayProps {
  startTime: number;
}

export function TimerDisplay({ startTime }: TimerDisplayProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Only run if startTime is valid (non-zero)
    if (!startTime) return;

    // Update immediately - Removed to prevent cascading render
    // setElapsedTime((Date.now() - startTime) / 1000);

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100); // Update every 100ms is sufficient for visual feedback

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Don't need centiseconds for general display if it causes too much distraction,
    // but the user's previous code had it. Let's keep it but maybe 100ms updates are fine.
    // If previous was 10ms, it was very fast. 100ms is standard stopwatch feel.
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${Math.floor(secs).toString().padStart(2, "0")},${centisecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md">
      <Clock size={18} className="text-orange-300" />
      <span className="font-mono text-xl font-bold tracking-widest text-white">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
}
