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
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm"
        >
          <Skeleton className="mb-4 h-32 w-full rounded-xl" />

          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-3/4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
