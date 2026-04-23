"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ExamContainer } from "@/features/user/cbt/containers/ExamContainer";
import { ExamSkeleton } from "@/features/user/cbt/components/ExamSkeleton";

function ExamContent() {
  const searchParams = useSearchParams();
  const examCode = searchParams.get("code");
  const examId = searchParams.get("examId");
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

  if (!examCode && !examId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef]">
        <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-5 text-neutral-900 shadow-sm">
          Kode ujian tidak valid
        </div>
      </div>
    );
  }

  return <ExamContainer stream={stream} examCode={examCode} examId={examId} />;
}

export default function CBTExamPage() {
  return (
    <Suspense fallback={<ExamSkeleton />}>
      <ExamContent />
    </Suspense>
  );
}
