import React from "react";
import { Award } from "lucide-react";

export const CourseProgress = ({ progress }: { progress: { current: number; total: number } }) => {
  const progressPercent = (progress.current / progress.total) * 100;

  return (
    <section className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400">
            <Award className="text-white" size={20} />
          </div>
          <div className="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-b-full bg-amber-400" />
        </div>
        <h3 className="text-base font-bold text-white">Your Progress</h3>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/20">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-500"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>
      <p className="mt-2 text-sm text-white/80">
        {progress.current}/{progress.total} exp
      </p>
    </section>
  );
};
