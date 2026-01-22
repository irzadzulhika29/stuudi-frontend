"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef } from "react";

interface ExamHeaderProps {
  title: string;
  subject: string;
  stream: MediaStream | null;
}

export function ExamHeader({ title, subject, stream }: ExamHeaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <header className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-white/70">{subject}</p>
        </div>
      </div>

      <div className="relative h-20 w-28 overflow-hidden rounded-lg border-2 border-white/20 bg-neutral-800">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full scale-x-[-1] object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/40">
            <Camera size={28} />
          </div>
        )}
      </div>
    </header>
  );
}
