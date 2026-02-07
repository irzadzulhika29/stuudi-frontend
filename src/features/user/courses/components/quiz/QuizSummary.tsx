"use client";

interface QuizSummaryProps {
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number | string;
  expEarned: number;
  score: number;
  status: "passed" | "failed";
  passingScore: number;
  onRetake: () => void;
  onBack: () => void;
  questionResults?: {
    question_id: string;
    question_text: string;
    question_type: string;
    is_correct: boolean;
    points_earned: number;
    max_points: number;
    your_answer: string;
    correct_answer: string;
    explanation: string;
  }[];
}

export function QuizSummary({
  correctAnswers,
  totalQuestions,
  averageTime,
  expEarned,
  score,
  status,
  passingScore,
  onRetake,
  onBack,
  questionResults,
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

  const isPassed = status === "passed";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <span
          className={`mb-3 rounded-full px-4 py-1.5 text-sm font-bold tracking-wider uppercase ${
            isPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {isPassed ? "Lulus" : "Tidak Lulus"}
        </span>
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          {isPassed ? "Hasil Quiz" : "Hasil Quiz"}
        </h1>
        <p className="text-white/60">
          {isPassed
            ? `Kamu berhasil menyelesaikan quiz.`
            : `Nilai kamu belum mencapai batas kelulusan (${passingScore}).`}
          <span className="ml-2 text-amber-400">+{expEarned} XP</span>
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Stats Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <h2 className="mb-8 text-center text-lg font-semibold text-white">Quiz Summary</h2>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Score */}
            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="mb-1 text-xs font-medium text-white/60">Score</p>
              <span
                className={`text-2xl font-bold ${isPassed ? "text-green-400" : "text-red-400"}`}
              >
                {score}
              </span>
            </div>

            {/* Correct */}
            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="mb-1 text-xs font-medium text-white/60">Correct</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-2xl font-bold text-white">{correctAnswers}</span>
                <span className="text-xs text-white/40">/{totalQuestions}</span>
              </div>
            </div>

            {/* Time */}
            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="mb-1 text-xs font-medium text-white/60">Avg Time</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-2xl font-bold text-white">{formatTime(averageTime)}</span>
                <span className="text-xs text-white/40">s/q</span>
              </div>
            </div>

            {/* Passing Score */}
            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="mb-1 text-xs font-medium text-white/60">Passing</p>
              <span className="text-2xl font-bold text-white/80">{passingScore}</span>
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

        {/* Detailed Review */}
        {questionResults && questionResults.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <h3 className="mb-6 text-xl font-semibold text-white">Review Jawaban</h3>
            <div className="space-y-4">
              {questionResults.map((result, index) => (
                <div
                  key={result.question_id}
                  className={`rounded-xl border p-5 transition-all ${
                    result.is_correct
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                          result.is_correct ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <h4 className="text-base font-medium text-white/90">
                        {result.question_text}
                      </h4>
                    </div>
                    <div
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        result.is_correct
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {result.is_correct ? `+${result.points_earned} Pts` : "0 Pts"}
                    </div>
                  </div>

                  <div className="mt-4 ml-11 space-y-3 text-sm">
                    <div className="rounded-lg bg-black/20 p-3">
                      <p className="mb-1 text-xs text-white/40">Jawaban Kamu:</p>
                      <p
                        className={`font-medium ${result.is_correct ? "text-green-400" : "text-red-400"}`}
                      >
                        {result.your_answer || "-"}
                      </p>
                    </div>

                    {!result.is_correct && (
                      <div className="rounded-lg bg-green-500/10 p-3">
                        <p className="mb-1 text-xs text-white/40">Jawaban Benar:</p>
                        <p className="font-medium text-green-400">{result.correct_answer}</p>
                      </div>
                    )}

                    {result.explanation && (
                      <div className="rounded-lg bg-blue-500/10 p-3">
                        <p className="mb-1 text-xs text-blue-400">Penjelasan:</p>
                        <p className="text-white/80">{result.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
