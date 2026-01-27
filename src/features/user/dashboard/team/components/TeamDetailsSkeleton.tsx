import Skeleton from "@/shared/components/ui/Skeleton";

export function TeamDetailsSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm md:p-8">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-6">
        <Skeleton className="mb-6 h-6 w-32" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="mb-4 h-5 w-48" />

              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-1.5 h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="mb-1.5 h-3 w-10" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
