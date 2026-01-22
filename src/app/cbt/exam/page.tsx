"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ExamContainer } from "@/features/user/cbt/containers/ExamContainer";

function ExamContent() {
  const searchParams = useSearchParams();
  const examCode = searchParams.get("code");
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        setStream(mediaStream);
      } catch (err) {
        console.error("Failed to get camera:", err);
      }
    };

    initCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    };
    requestFullscreen();
  }, []);

  if (!examCode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">Kode ujian tidak valid</p>
      </div>
    );
  }

  return <ExamContainer stream={stream} />;
}

export default function CBTExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900" />}>
      <ExamContent />
    </Suspense>
  );
}
