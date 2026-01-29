import React from "react";
import Skeleton from "@/shared/components/ui/Skeleton";

export const MateriDetailSkeleton = () => {
  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Main Content Column */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumb Skeleton */}
          <div className="mb-4 flex items-center gap-2 md:mb-6">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>

          {/* Mobile Sidebar Skeleton */}
          <div className="mb-6 lg:hidden">
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" /> {/* Progress */}
              <Skeleton className="h-40 w-full rounded-xl" /> {/* Notes */}
            </div>
          </div>

          {/* Title Header Skeleton */}
          <div className="flex items-start justify-between gap-4 p-5">
            <Skeleton className="h-8 w-3/4 rounded-lg md:h-9" />
            <Skeleton className="h-9 w-32 rounded-lg" /> {/* Completion Button */}
          </div>

          {/* Content Blocks Skeleton */}
          <div className="space-y-6 p-5 md:p-6">
            {/* Text Block Simulation */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-[95%] rounded" />
              <Skeleton className="h-4 w-[98%] rounded" />
              <Skeleton className="h-4 w-[90%] rounded" />
            </div>

            {/* Media Block Simulation */}
            <div className="overflow-hidden rounded-lg">
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="mt-2 flex justify-center">
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>

            {/* More Text */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-[92%] rounded" />
              <Skeleton className="h-4 w-[96%] rounded" />
            </div>
          </div>

          {/* Back Button Skeleton */}
          <div className="mt-4">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Right Sidebar Skeleton (Desktop) */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" /> {/* Progress */}
            <Skeleton className="h-64 w-full rounded-xl" /> {/* Notes */}
          </div>
        </div>
      </div>
    </div>
  );
};
