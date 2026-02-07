"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { AnimatePresence, motion } from "framer-motion";

interface CountdownTime {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="group hover:border-secondary/50 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(31,38,135,0.37)] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(255,165,0,0.2)] md:h-20 md:w-20">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="relative z-10 text-2xl font-bold text-white md:text-3xl"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] font-medium tracking-widest text-white/50 uppercase md:text-xs">
      {label}
    </span>
  </div>
);

export function DashboardCountdown() {
  const { data: exam, isLoading } = useQuery({
    queryKey: ["upcomingExam"],
    queryFn: () => dashboardService.getUpcomingExam(),
  });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (targetTime: string | undefined): CountdownTime => {
    if (!targetTime) {
      return { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    const targetDate = new Date(targetTime).getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { months, weeks, days, hours, minutes, seconds, totalSeconds: difference / 1000 };
  };

  const timeLeft = calculateTimeLeft(exam?.start_at);

  if (isLoading) {
    return <div className="h-24 w-full animate-pulse rounded-xl bg-white/5" />;
  }

  const isCritical = !exam || (exam && timeLeft.totalSeconds < 24 * 60 * 60);

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-lg font-medium text-blue-100/80 md:text-xl">
        {exam?.title ?? "Belum ada jadwal ujian"}
      </h2>

      <div className="flex gap-3 md:gap-4">
        {isCritical ? (
          <>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </>
        ) : (
          <>
            <TimeUnit value={timeLeft.months} label="Months" />
            <TimeUnit value={timeLeft.weeks} label="Weeks" />
            <TimeUnit value={timeLeft.days} label="Days" />
          </>
        )}
      </div>
    </div>
  );
}
