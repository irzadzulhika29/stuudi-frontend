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
          className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 p-4 shadow-sm"
        >
          {/* Thumbnail Skeleton */}
          <Skeleton className="mb-4 h-32 w-full rounded-xl bg-white/10" />

          <div className="flex flex-1 flex-col space-y-4 pt-4">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 bg-white/10" />
              <Skeleton className="h-6 w-1/2 bg-white/10" />
            </div>

            {/* Footer Skeleton */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-20 bg-white/10" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-8 bg-white/10" />
                  <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
