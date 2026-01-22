"use client";

import Image from "next/image";
import { ExamQuestion } from "../types/examTypes";

interface QuestionCardProps {
  question: ExamQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

export function QuestionCard({ question, selectedAnswer, onSelectAnswer }: QuestionCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
      {question.image && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden">
          <Image
            src={question.image}
            alt="Question image"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-6 text-lg font-medium text-neutral-800">{question.text}</p>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => (
            <label
              key={option.label}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                selectedAnswer === option.label
                  ? "border-orange-500 bg-orange-50"
                  : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.label}
                checked={selectedAnswer === option.label}
                onChange={() => onSelectAnswer(option.label)}
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                  selectedAnswer === option.label
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-neutral-300 text-neutral-500"
                }`}
              >
                {option.label}
              </div>
              <span className="text-neutral-700">{option.text}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
