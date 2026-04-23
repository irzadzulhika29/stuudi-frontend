"use client";

import { Loader2 } from "lucide-react";

interface ExamSkeletonProps {
  title?: string;
  description?: string;
}

export function ExamSkeleton({
  title = "Memuat ujian",
  description = "Mohon tunggu sebentar.",
}: ExamSkeletonProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-900" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
