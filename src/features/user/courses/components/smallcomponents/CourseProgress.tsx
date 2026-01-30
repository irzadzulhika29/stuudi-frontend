import React from "react";
import { Award } from "lucide-react";

export const CourseProgress = ({ progress }: { progress: { current: number; total: number } }) => {
  const progressPercent = (progress.current / progress.total) * 100;

  return (
    <section className="rounded-xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md transition-all hover:bg-white/15">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm">
            <Award size={20} />
          </div>
          {/* Simple decorative element */}
          <div className="bg-secondary-dark/50 absolute -bottom-1 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full" />
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white/70 uppercase">
            Course Progress
          </h3>
          <p className="font-mono text-lg leading-none font-bold text-white">
            {progressPercent.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-black/20">
        <div
          className="from-secondary-light to-primary absolute top-0 left-0 h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs font-medium">
        <span className="text-white/50">Total XP Earned</span>
        <span className="text-secondary-light">
          {progress.current} <span className="text-white/40">/ {progress.total}</span>
        </span>
      </div>
    </section>
  );
};
