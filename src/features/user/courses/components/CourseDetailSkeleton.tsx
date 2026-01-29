import Skeleton from "@/shared/components/ui/Skeleton";

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="h-48 w-full rounded-xl md:w-1/3" />

          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div>
              <Skeleton className="mb-4 h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
