"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { decrementTime } from "@/shared/store/slices/examSlice";

/**
 * Custom hook to manage exam countdown timer.
 * Automatically decrements time every second while exam is active.
 * Stops when time runs out, lives are depleted, or exam is finished.
 */
export function useExamTimer() {
  const dispatch = useAppDispatch();
  const { timeRemaining, lives, view } = useAppSelector((state) => state.exam);

  useEffect(() => {
    // Don't run timer if exam is finished, time is up, or lives depleted
    if (timeRemaining <= 0 || lives <= 0 || view === "finished") {
      return;
    }

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, lives, view, dispatch]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours,
      minutes: mins,
      seconds: secs,
      formatted: `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
    };
  };

  return {
    timeRemaining,
    isTimeUp: timeRemaining <= 0,
    isCritical: timeRemaining <= 300, // 5 minutes warning
    formattedTime: formatTime(timeRemaining),
  };
}
