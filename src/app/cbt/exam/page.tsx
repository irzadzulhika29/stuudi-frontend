"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ExamContent() {
  const searchParams = useSearchParams();
  const examCode = searchParams.get("code");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Exam in Progress</h1>
        <p className="mb-8 text-xl text-neutral-400">
          Code: <span className="text-secondary">{examCode}</span>
        </p>
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="mb-4">
            Ini adalah halaman placeholder untuk ujian. Di sini nanti akan ada soal-soal, timer, dan
            fitur ujian lainnya.
          </p>
          <div className="flex animate-pulse justify-center space-x-4">
            <div className="bg-secondary h-2 w-2 rounded-full"></div>
            <div className="bg-secondary h-2 w-2 rounded-full"></div>
            <div className="bg-secondary h-2 w-2 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CBTExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900" />}>
      <ExamContent />
    </Suspense>
  );
}
