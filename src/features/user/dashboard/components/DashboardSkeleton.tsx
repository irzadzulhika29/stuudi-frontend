import Image from "next/image";

export function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      {/* Header Skeleton */}
      <div className="mb-6 grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-white/5" />
        </div>
        <div className="h-16 w-32 animate-pulse justify-self-center bg-white/5 opacity-0 md:h-20 md:w-40 md:opacity-100" />
        <div className="hidden md:block" />
      </div>

      {/* Countdown Skeleton */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 animate-pulse rounded-2xl bg-white/10 md:h-20 md:w-20" />
              <div className="h-3 w-8 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Active Attempt Skeleton */}
      <div className="mb-6 w-full max-w-lg px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* Exam Code Input Skeleton */}
      <div className="mb-8 w-full max-w-md px-4">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-white/5" />
      </div>

      {/* Table Skeleton */}
      <div className="w-full max-w-2xl px-4">
        <div className="h-64 w-full animate-pulse rounded-xl bg-white/5" />
      </div>

      {/* Mascot Skeleton Left */}
      <div className="pointer-events-none absolute bottom-16 -left-16 -z-10 hidden h-96 w-96 animate-pulse opacity-2 lg:block">
        <Image
          src="/images/mascot/chiby.webp"
          alt=""
          width={384}
          height={384}
          className="object-contain object-bottom opacity-25 brightness-0 grayscale invert"
        />
      </div>

      {/* Mascot Skeleton Right */}
      <div className="pointer-events-none absolute -right-16 bottom-16 -z-10 hidden h-96 w-96 animate-pulse opacity-5 grayscale lg:block">
        <Image
          src="/images/mascot/chiby.webp"
          alt=""
          width={384}
          height={384}
          className="scale-x-[-1] object-contain object-bottom opacity-25 brightness-0 grayscale invert"
        />
      </div>
    </div>
  );
}
