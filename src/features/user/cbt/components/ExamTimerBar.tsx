"use client";

import { Heart } from "lucide-react";

interface ExamTimerBarProps {
  currentQuestion: number;
  timeRemaining: number;
  lives: number;
}

export function ExamTimerBar({ currentQuestion, timeRemaining, lives }: ExamTimerBarProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between">
      <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
        Soal no: {currentQuestion}
      </div>

      <div className="rounded-full border border-white/20 bg-white/10 px-6 py-2 font-mono text-lg text-white">
        {displayTime}
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
          <Heart size={16} className="fill-amber-500 text-amber-500" />
          <span className="font-semibold">Nyawa: {lives}</span>
        </div>
      </div>
    </div>
  );
}
