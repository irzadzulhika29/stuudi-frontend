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
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
        All done! <span className="text-amber-400">+{expEarned} exp</span>
      </h1>

      <div className="mt-10 w-full max-w-md">
        <h2 className="text-lg font-semibold text-white text-center mb-6">
          Quiz Summary
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-amber-400 rounded-xl p-4 text-center">
            <p className="text-white/90 text-sm font-medium mb-1">
              Correct Answer
            </p>
            <p className="text-white text-3xl font-bold">
              {correctAnswers}/{totalQuestions}
              <span className="text-base font-normal ml-1">questions</span>
            </p>
          </div>
          <div className="bg-amber-400 rounded-xl p-4 text-center">
            <p className="text-white/90 text-sm font-medium mb-1">
              Average Answer Time
            </p>
            <p className="text-white text-3xl font-bold">
              {formatTime(averageTime)}
              <span className="text-base font-normal ml-1">sec/question</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetake}
            className="w-full py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            Back to Course Detail
          </button>
        </div>
      </div>
    </div>
  );
}
