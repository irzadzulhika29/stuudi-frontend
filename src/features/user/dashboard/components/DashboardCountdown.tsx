"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

interface CountdownTime {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

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
      return {
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      };
    }

    const targetDate = new Date(targetTime).getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      };
    }

    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: difference / 1000,
    };
  };

  const timeLeft = calculateTimeLeft(exam?.start_at);

  if (isLoading) {
    return <div className="h-8 w-48 animate-pulse rounded bg-white/10" />;
  }

  const isCritical = exam && timeLeft.totalSeconds < 24 * 60 * 60;

  return (
    <div className="flex flex-col items-center">
      <h2 className="md:text-md mb-2 text-lg font-semibold text-white">
        {exam?.title || "Exam: Belum ada jadwal"}
      </h2>
      <div
        className="text-xl font-bold tracking-wider text-white md:text-2xl"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        {isCritical ? (
          <>
            <span className="text-secondary-light">{String(timeLeft.hours).padStart(2, "0")}</span>{" "}
            Hours :{" "}
            <span className="text-secondary-light">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>{" "}
            Minutes :{" "}
            <span className="text-secondary-light">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>{" "}
            Seconds
          </>
        ) : (
          <>
            <span className="text-secondary-light">{String(timeLeft.months).padStart(2, "0")}</span>{" "}
            Months :{" "}
            <span className="text-secondary-light">{String(timeLeft.weeks).padStart(2, "0")}</span>{" "}
            Week :{" "}
            <span className="text-secondary-light">{String(timeLeft.days).padStart(2, "0")}</span>{" "}
            Days
          </>
        )}
      </div>
    </div>
  );
}
