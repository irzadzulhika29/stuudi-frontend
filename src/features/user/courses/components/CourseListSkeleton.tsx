import Skeleton from "@/shared/components/ui/Skeleton";

interface CourseListSkeletonProps {
  count?: number;
}

export function CourseListSkeleton({ count = 6 }: CourseListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-sm sm:p-4"
        >
          {/* Thumbnail Skeleton */}
          <Skeleton className="mb-4 aspect-video w-full rounded-2xl bg-white/10" />

          <div className="flex flex-1 items-stretch gap-3 pt-2 pr-1 pl-1 sm:pt-3">
            {/* Left Column Skeleton */}
            <div className="flex w-[65%] flex-col justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                <Skeleton className="h-4 w-2/3 rounded-md bg-white/10" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-3 w-3 bg-white/10" />
                <Skeleton className="h-3 w-16 bg-white/10" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="flex w-[35%] items-end justify-end">
              <Skeleton className="h-10 w-10 rounded-full bg-white/10 sm:h-12 sm:w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
