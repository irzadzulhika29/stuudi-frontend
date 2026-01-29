import Skeleton from "@/shared/components/ui/Skeleton";

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          {/* Breadcrumb & Header Skeleton */}
          <div className="mb-6 md:mb-8">
            <Skeleton className="mb-4 h-4 w-48 bg-white/10" />
            <Skeleton className="mb-3 h-8 w-3/4 bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl bg-white/10" />
              <Skeleton className="h-4 w-2/3 max-w-2xl bg-white/10" />
            </div>
          </div>

          {/* Mobile Sidebar Skeleton (Split to match sidebar components) */}
          <div className="mb-6 space-y-3 lg:hidden">
            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
          </div>

          {/* Topic List Skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white/5 shadow-sm">
                <div className="border-l-4 border-white/20 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-full space-y-2">
                      <Skeleton className="h-6 w-1/3 bg-white/10" />
                      <Skeleton className="h-4 w-2/3 bg-white/10" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar Skeleton (Split components) */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-3">
            {/* Progress/Stats Placeholder */}
            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
            {/* Notes/Chat Placeholder */}
            <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
            {/* People/Other Placeholder */}
            <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
