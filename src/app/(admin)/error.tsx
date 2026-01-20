"use client";

import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Terjadi Kesalahan</h1>
          <p className="text-sm text-gray-600">
            Maaf, terjadi kesalahan saat memuat halaman admin. Silakan coba lagi.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
          >
            <ArrowLeft size={16} />
            <span>Ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
