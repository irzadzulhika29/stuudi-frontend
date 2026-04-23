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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
        Soal no: {currentQuestion}
      </div>

      <div className="rounded-full border border-neutral-200 bg-white px-6 py-2 font-mono text-lg text-neutral-950 shadow-sm">
        {displayTime}
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm">
          <Heart size={16} className="fill-amber-500 text-amber-500" />
          <span className="font-semibold">Nyawa: {lives}</span>
        </div>
      </div>
    </div>
  );
}
