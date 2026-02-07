"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export function EmptyExamState() {
  return (
    <Link
      href="/courses"
      className="group relative flex w-full max-w-2xl items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors group-hover:bg-white/20 group-hover:text-white">
        <BookOpen size={20} />
      </div>

      <div className="flex-1 text-left">
        <h3 className="group-hover:text-secondary-light text-sm font-medium text-white transition-colors">
          Belum ada ujian aktif
        </h3>
        <p className="text-xs text-white/50">Istirahat dulu atau pelajari materi baru.</p>
      </div>

      <div className="text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}
