import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { quizService } from "../services/quizService";
import { QuizQuestion } from "../types/courseTypes";
import { SingleChoiceQuestion } from "@/shared/components/questions/SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "@/shared/components/questions/MultipleChoiceQuestion";
import { SharedQuestion, QuestionType, QuestionAnswer } from "@/shared/types/questionTypes";

interface QuizBlockQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
}

export function QuizBlockQuestion({ question, questionNumber }: QuizBlockQuestionProps) {
  // State can hold single string (radio) or array of strings (checkbox)
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionAnswer>(null);

  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctOptionId: string;
  } | null>(null);

  const checkAnswerMutation = useMutation({
    mutationFn: () => {
      if (!selectedAnswer) throw new Error("No option selected");
      return quizService.checkAnswer(question.questionId, selectedAnswer as string | string[]);
    },
    onSuccess: (data) => {
      setResult({
        isCorrect: data.is_correct,
        correctOptionId: data.correct_option_id,
      });
    },
  });

  const isSubmitted = result !== null;

  const sharedType: QuestionType = question.questionType === "multiple" ? "multiple" : "single";

  const sharedQuestion: SharedQuestion = {
    id: question.questionId,
    text: question.questionText,
    type: sharedType,
    points: question.points,
    options: question.options.map((opt) => ({
      id: opt.optionId,
      text: opt.optionText,
      sequence: opt.sequence,
    })),
  };

  const handleSelectAnswer = (ans: QuestionAnswer) => {
    if (!isSubmitted) {
      setSelectedAnswer(ans);
    }
  };

  const hasSelection = Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : !!selectedAnswer;

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-light text-gray-500">Pertanyaan {questionNumber}</span>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-red-500">
          {question.points} Poin
        </span>
      </div>

      <p className="mb-4 font-medium text-black">{question.questionText}</p>

      {sharedType === "multiple" ? (
        <MultipleChoiceQuestion
          question={sharedQuestion}
          selectedAnswer={selectedAnswer || []}
          onSelectAnswer={handleSelectAnswer}
          disabled={isSubmitted}
          isCorrect={isSubmitted ? result.isCorrect : undefined}
        />
      ) : (
        <SingleChoiceQuestion
          question={sharedQuestion}
          selectedAnswer={selectedAnswer as string}
          onSelectAnswer={handleSelectAnswer}
          disabled={isSubmitted}
          isCorrect={isSubmitted ? result.isCorrect : undefined}
          correctAnswerId={result?.correctOptionId}
        />
      )}

      {!isSubmitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => checkAnswerMutation.mutate()}
            disabled={!hasSelection || checkAnswerMutation.isPending}
            className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
              hasSelection && !checkAnswerMutation.isPending
                ? "bg-primary-light hover:bg-primary-light/90 text-white"
                : "cursor-not-allowed bg-white/20 text-white/50"
            }`}
          >
            {checkAnswerMutation.isPending ? "Memeriksa..." : "Cek Jawaban"}
          </button>
        </div>
      )}

      {isSubmitted && (
        <div
          className={`mt-4 rounded-lg p-3 ${result.isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"}`}
        >
          <div className="flex items-center gap-2">
            {result.isCorrect ? (
              <>
                <Check size={20} className="text-emerald-500" />
                <span className="font-medium text-emerald-400">Jawaban Benar!</span>
              </>
            ) : (
              <>
                <X size={20} className="text-red-500" />
                <span className="font-medium text-red-400">Jawaban Salah</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
