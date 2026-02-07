"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setLives } from "@/shared/store/slices/examSlice";
import { examService } from "../services/examService";

interface UseFullscreenGuardOptions {
  enabled?: boolean;
  onViolation?: (livesRemaining: number) => void;
}

/**
 * Custom hook for managing fullscreen enforcement during exams.
 * Handles:
 * - Detecting when user exits fullscreen
 * - Recording tab switches as violations
 * - Providing overlay state for UI blocking
 */
export function useFullscreenGuard(options: UseFullscreenGuardOptions = {}) {
  const { enabled = true, onViolation } = options;
  const dispatch = useAppDispatch();

  const { view, examData } = useAppSelector((state) => state.exam);

  const [showOverlay, setShowOverlay] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  // Request fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      return true;
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
      return false;
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Failed to exit fullscreen:", err);
    }
  }, []);

  // Check if currently fullscreen
  const isFullscreen = useCallback(() => {
    return !!document.fullscreenElement;
  }, []);

  useEffect(() => {
    if (!enabled || view === "finished") return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
        setHasInteracted(true);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.hidden && hasInteracted && examData?.attempt_id) {
        try {
          const result = await examService.recordTabSwitch(examData.attempt_id);

          if (result) {
            dispatch(setLives(result.lives_remaining));
            setViolationCount((prev) => prev + 1);

            if (onViolation) {
              onViolation(result.lives_remaining);
            }
          }
        } catch (e) {
          console.error("Failed to record tab switch", e);
        }
      }
    };

    // Polling backup for fullscreen detection
    const pollingInterval = setInterval(() => {
      if (!document.fullscreenElement && !showOverlay && view !== "intro") {
        setShowOverlay(true);
      }
    }, 1000);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(pollingInterval);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, view, showOverlay, hasInteracted, examData?.attempt_id, dispatch, onViolation]);

  return {
    showOverlay,
    violationCount,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
  };
}
