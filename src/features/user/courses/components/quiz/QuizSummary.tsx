"use client";

interface QuizSummaryProps {
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number | string;
  expEarned: number;
  onRetake: () => void;
  onBack: () => void;
}

export function QuizSummary({
  correctAnswers,
  totalQuestions,
  averageTime,
  expEarned,
  onRetake,
  onBack,
}: QuizSummaryProps) {
  const formatTime = (time: number | string) => {
    if (typeof time === "string") {
      return time.replace(" sec/question", "");
    }
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const centisecs = Math.floor((time % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${centisecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
        🎉 All done! <span className="text-amber-400">+{expEarned} exp</span>
      </h1>
      <p className="mb-8 text-white/60">Hebat! Kamu telah menyelesaikan quiz ini.</p>

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <h2 className="mb-8 text-center text-lg font-semibold text-white">Quiz Summary</h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
            <p className="mb-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
              Correct Answer
            </p>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-2xl font-bold text-white md:text-3xl">
                {correctAnswers}/{totalQuestions}
              </span>
              <span className="text-xs text-white/40 transition-colors group-hover:text-white/60">
                questions
              </span>
            </div>
          </div>

          <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
            <p className="mb-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
              Average Time
            </p>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="truncate text-xl font-bold text-white md:text-3xl">
                {formatTime(averageTime)}
              </span>
              <span className="text-xs text-white/40 transition-colors group-hover:text-white/60">
                sec/q
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetake}
            className="w-full rounded-full border border-white/20 bg-white/5 py-3.5 font-medium text-white transition-all hover:bg-white/10 hover:shadow-md active:scale-[0.98]"
          >
            Ulangi Quiz
          </button>
          <button
            onClick={onBack}
            className="w-full rounded-full border border-transparent bg-amber-500 py-3.5 font-medium text-white shadow-lg transition-all hover:bg-amber-400 hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            Kembali ke Materi
          </button>
        </div>
      </div>
    </div>
  );
}
