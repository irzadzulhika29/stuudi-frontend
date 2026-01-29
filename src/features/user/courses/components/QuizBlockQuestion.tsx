"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { quizService } from "../services/quizService";
import { QuizQuestion, QuizOption } from "../types/courseTypes";

interface QuizBlockQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
}

export function QuizBlockQuestion({ question, questionNumber }: QuizBlockQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctOptionId: string;
  } | null>(null);

  const checkAnswerMutation = useMutation({
    mutationFn: () => {
      if (!selectedOptionId) throw new Error("No option selected");
      return quizService.checkAnswer(question.questionId, selectedOptionId);
    },
    onSuccess: (data) => {
      setResult({
        isCorrect: data.is_correct,
        correctOptionId: data.correct_option_id,
      });
    },
  });

  const isSubmitted = result !== null;

  const getOptionStyle = (option: QuizOption) => {
    if (!isSubmitted) {
      if (selectedOptionId === option.optionId) {
        return "border-primary-light bg-primary-light/20";
      }
      return "border-white/20 hover:border-white/40";
    }

    // After submission
    if (option.optionId === result.correctOptionId) {
      return "border-emerald-500 bg-emerald-500/20";
    }
    if (option.optionId === selectedOptionId && !result.isCorrect) {
      return "border-red-500 bg-red-500/20";
    }
    return "border-white/20 opacity-50";
  };

  const getOptionIcon = (option: QuizOption) => {
    if (!isSubmitted) return null;

    if (option.optionId === result.correctOptionId) {
      return <Check size={18} className="text-emerald-500" />;
    }
    if (option.optionId === selectedOptionId && !result.isCorrect) {
      return <X size={18} className="text-red-500" />;
    }
    return null;
  };

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Pertanyaan {questionNumber}</span>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-red-500">
          {question.points} Poin
        </span>
      </div>

      <p className="mb-4 font-medium text-white">{question.questionText}</p>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={option.optionId}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${getOptionStyle(option)} ${
              isSubmitted ? "pointer-events-none" : ""
            }`}
          >
            <input
              type="radio"
              name={`quiz-${question.questionId}`}
              checked={selectedOptionId === option.optionId}
              onChange={() => !isSubmitted && setSelectedOptionId(option.optionId)}
              disabled={isSubmitted}
              className="accent-primary-light h-4 w-4"
            />
            <span className="flex-1 text-sm text-white">
              {String.fromCharCode(65 + index)}. {option.optionText}
            </span>
            {getOptionIcon(option)}
          </label>
        ))}
      </div>

      {!isSubmitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => checkAnswerMutation.mutate()}
            disabled={!selectedOptionId || checkAnswerMutation.isPending}
            className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
              selectedOptionId && !checkAnswerMutation.isPending
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
