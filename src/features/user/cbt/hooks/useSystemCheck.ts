"use client";

import { useEffect, useRef, useState } from "react";
import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";
import { formatExamAccessWindow, getExamAccessStatus } from "../utils/accessExamStatus";

interface UseSystemCheckParams {
  examData: ExamAccessData;
  isLoading?: boolean;
}

export function useSystemCheck({ examData, isLoading = false }: UseSystemCheckParams) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      if (hasEnteredFullscreen && !isFull) {
        setShowFullscreenOverlay(true);
        return;
      }

      if (isFull) {
        setHasEnteredFullscreen(true);
        setShowFullscreenOverlay(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasEnteredFullscreen]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
      setError("Gagal masuk mode fullscreen.");
    }
  };

  const requestCamera = async () => {
    try {
      setIsCameraLoading(true);
      setError("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API not supported");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 720 },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error("Camera error details:", err);
      setError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const accessStatus = getExamAccessStatus(examData);
  const allChecksPassed = isFullscreen && isCameraActive;
  const canStartExam = allChecksPassed && accessStatus.isEligible && !isLoading;
  const accessWindow = formatExamAccessWindow(examData.start_time, examData.end_time);

  const statusItems = [
    {
      label: "Fullscreen",
      value: isFullscreen ? "Aktif" : "Belum aktif",
      isComplete: isFullscreen,
      action: "fullscreen" as const,
    },
    {
      label: "Kamera",
      value: isCameraActive ? "Terhubung" : "Belum aktif",
      isComplete: isCameraActive,
      action: "camera" as const,
    },
  ];

  return {
    videoRef,
    stream,
    error,
    isCameraActive,
    isCameraLoading,
    showFullscreenOverlay,
    accessStatus,
    canStartExam,
    accessWindow,
    statusItems,
    requestFullscreen,
    requestCamera,
  };
}
