"use client";

import { Loader2 } from "lucide-react";

interface ExamProgressIndicatorProps {
  stage: string;
  current: number;
  total: number;
}

export function ExamProgressIndicator({ stage, current, total }: ExamProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>
          {stage} ({current}/{total})
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{
            width: `${(current / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
