import Skeleton from "@/shared/components/ui/Skeleton";

export function TopicDetailSkeleton() {
  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          {/* Breadcrumb & Header Skeleton */}
          <div className="mb-6 md:mb-8">
            <Skeleton className="mb-4 h-4 w-64 bg-white/10" />
            <Skeleton className="mb-3 h-8 w-1/2 bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl bg-white/10" />
              <Skeleton className="h-4 w-2/3 max-w-2xl bg-white/10" />
            </div>
          </div>

          {/* Mobile Sidebar Skeleton */}
          <div className="mb-6 space-y-3 lg:hidden">
            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
          </div>

          {/* Material List Skeleton */}
          <div className="overflow-hidden rounded-xl shadow-sm">
            {/* Header portion */}
            {/* Header portion */}
            <div className="border-l-4 border-white/20 bg-white/5 p-5">
              <Skeleton className="mb-2 h-6 w-48 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>

            {/* List items */}
            <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    index !== 3 ? "border-b border-white/10" : ""
                  }`}
                >
                  <Skeleton className="h-5 w-2/3 max-w-md bg-white/10" />
                  {/* Optional checkmark placeholder */}
                  {index % 2 === 0 && <Skeleton className="h-4 w-4 rounded-full bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Skeleton */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-3">
            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
