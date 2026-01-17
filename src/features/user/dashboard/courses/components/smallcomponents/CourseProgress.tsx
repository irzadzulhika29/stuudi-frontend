import React from "react";
import { Award } from "lucide-react";

export const CourseProgress = ({ progress }: { progress: { current: number; total: number } }) => {
  const progressPercent = (progress.current / progress.total) * 100;

  return (
    <section className="bg-primary-dark rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
            <Award className="text-white" size={20} />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-amber-400 rounded-b-full" />
        </div>
        <h3 className="font-bold text-white text-base">Your Progress</h3>
      </div>
      <div className="relative h-2.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-500"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>
      <p className="text-sm text-white/80 mt-2">
        {progress.current}/{progress.total} exp
      </p>
    </section>
  );
};
