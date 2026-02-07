"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loader displayed while exam data is being fetched.
 * Shows animated placeholders that match the exam UI layout.
 */
export function ExamSkeleton() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
          </div>
        </div>
        <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
      </div>

      {/* Timer Bar Skeleton */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded bg-white/10" />
          <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-8 w-32 animate-pulse rounded-full bg-orange-500/20" />
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 animate-pulse rounded-full bg-red-500/20" />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Question Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-3"
        >
          {/* Question Number */}
          <div className="mb-4 h-6 w-24 animate-pulse rounded bg-white/10" />

          {/* Question Text */}
          <div className="mb-8 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
                <div
                  className="h-4 flex-1 animate-pulse rounded bg-white/10"
                  style={{ width: `${70 - i * 10}%` }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
        >
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex h-10 w-10 animate-pulse items-center justify-center rounded-lg bg-white/10"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          <div className="mt-auto pt-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-orange-500/20" />
          </div>
        </motion.div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
        <div className="h-10 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-white/10" />
      </div>

      {/* Loading Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-neutral-900/90 p-8 backdrop-blur-xl"
        >
          <div className="relative h-12 w-12">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-sm font-medium text-white/70">Memuat ujian...</p>
        </motion.div>
      </div>
    </div>
  );
}
