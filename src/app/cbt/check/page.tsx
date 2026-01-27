"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SystemCheckContainer } from "@/features/user/cbt/containers/SystemCheckContainer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function CheckContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examCode = searchParams.get("code");
  const examName = "Ujian Tengah Semester - Matematika Dasar";

  const handleChecksComplete = () => {
    router.push(`/cbt/exam?code=${examCode}`);
  };

  if (!examCode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Kode Ujian Tidak Valid</h1>
          <Link
            href="/dashboard"
            className="text-secondary flex items-center justify-center gap-2 hover:underline"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="fixed top-0 left-0 z-10 flex w-full items-center justify-between border-b border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-white/20"></div>
          <div>
            <span className="block text-xs text-neutral-400">Nama Ujian</span>
            <span className="font-semibold text-white">{examName}</span>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up relative z-0 mt-16 w-full">
        <SystemCheckContainer examName={examName} onChecksComplete={handleChecksComplete} />
      </div>
    </div>
  );
}

export default function CBTCheckPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900" />}>
      <CheckContent />
    </Suspense>
  );
}
