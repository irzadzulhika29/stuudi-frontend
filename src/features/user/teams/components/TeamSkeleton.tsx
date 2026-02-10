export function TeamSkeleton() {
  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-8 h-10 w-48 rounded-lg bg-white/10"></div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
          {/* Team Info Grid Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-24 rounded bg-white/10"></div>
                <div className="h-12 w-full rounded-lg bg-white/5"></div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="mb-6 h-7 w-32 rounded bg-white/10"></div>

            {/* Members Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="mb-4 h-6 w-24 rounded bg-white/10"></div>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1.5 h-4 w-20 rounded bg-white/10"></div>
                      <div className="h-10 w-full rounded-lg bg-white/5"></div>
                    </div>
                    <div>
                      <div className="mb-1.5 h-4 w-12 rounded bg-white/10"></div>
                      <div className="h-10 w-full rounded-lg bg-white/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
