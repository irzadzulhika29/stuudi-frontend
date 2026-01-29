"use client";

interface QuizSummaryProps {
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number;
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${centisecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="mb-1 text-3xl font-bold text-white md:text-4xl">
        All done! <span className="text-amber-400">+{expEarned} exp</span>
      </h1>

      <div className="mt-10 w-full max-w-md">
        <h2 className="mb-6 text-center text-lg font-semibold text-white">Quiz Summary</h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-amber-400 p-4 text-center">
            <p className="mb-1 text-sm font-medium text-white/90">Correct Answer</p>
            <p className="text-3xl font-bold text-white">
              {correctAnswers}/{totalQuestions}
              <span className="ml-1 text-base font-normal">questions</span>
            </p>
          </div>
          <div className="rounded-xl bg-amber-400 p-4 text-center">
            <p className="mb-1 text-sm font-medium text-white/90">Average Answer Time</p>
            <p className="text-3xl font-bold text-white">
              {formatTime(averageTime)}
              <span className="ml-1 text-base font-normal">sec/question</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetake}
            className="w-full rounded-full border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBack}
            className="w-full rounded-full border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            Back to Course Detail
          </button>
        </div>
      </div>
    </div>
  );
}
