"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function ExamCodeInput() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter an exam code");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/cbt/check?code=${encodeURIComponent(code)}`);
    }, 800);
  };

  return (
    <div className="relative mb-8 w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter Exam Code"
          className={`w-full border-2 bg-transparent ${
            error ? "border-red-400" : "border-white/50 focus:border-white"
          } rounded-full px-6 py-3 pr-12 text-center text-lg font-medium text-white placeholder-white/60 transition-all focus:bg-white/10 focus:outline-none`}
        />
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
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
