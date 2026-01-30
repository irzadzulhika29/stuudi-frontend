"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { dashboardService } from "../services/dashboardService";

export function ExamCodeInput() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: 6 characters required
    if (code.length !== 6) {
      setError("Kode ujian harus 6 karakter.");
      return;
    }

    setIsLoading(true);
    setError("");
    console.log("Submitting exam code:", code);

    try {
      const data = await dashboardService.accessExam(code);
      console.log("Exam accessed successfully:", data);
      router.push(`/cbt/check?code=${encodeURIComponent(code)}`);
    } catch (err: unknown) {
      console.log("Error accessing exam:", err);
      let message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Invalid exam code or access denied.";

      // Error message translation
      if (message.toLowerCase().includes("exam not found")) {
        message = "Exam tidak ditemukan";
      } else if (message.toLowerCase().includes("invalid request body")) {
        message = "Format kode tidak valid (harus 6 karakter)";
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mb-8 w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            // Auto convert to uppercase
            const val = e.target.value.toUpperCase();
            // Optional: Limit to 6 chars if desired, but user didn't explicitly ask to limit input, just validate
            if (val.length <= 6) {
              setCode(val);
            }
            if (error) setError("");
          }}
          placeholder="Masukkan Kode Ujian (6 Digit)"
          className={`w-full border-2 bg-transparent ${
            error ? "border-red-400" : "border-white/50 focus:border-white"
          } rounded-full px-6 py-3 pr-12 text-center text-lg font-medium text-white placeholder-white/60 transition-all focus:bg-white/10 focus:outline-none`}
        />
        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="text-secondary hover:bg-secondary absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-2 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>
      {error && (
        <p className="animate-fade-in absolute -bottom-6 left-0 w-full text-center text-sm font-medium text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
