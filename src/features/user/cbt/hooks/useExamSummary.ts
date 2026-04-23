"use client";

import { useState } from "react";
import { ExamQuestion } from "@/features/user/cbt/types/examTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import { countAnsweredQuestions, hasMeaningfulAnswer } from "../utils/answerState";

interface UseExamSummaryParams {
  questions: ExamQuestion[];
  answers: Record<string, QuestionAnswer>;
  flaggedQuestions: string[];
  onConfirmSubmit: () => void;
}

function getOptionText(question: ExamQuestion, optionId: string) {
  return question.options.find((option) => option.option_id === optionId)?.option_text ?? optionId;
}

function buildAnswerPreview(question: ExamQuestion, answer: QuestionAnswer) {
  if (!hasMeaningfulAnswer(answer)) {
    return "Belum dijawab";
  }

  if (typeof answer === "string") {
    return getOptionText(question, answer);
  }

  if (Array.isArray(answer)) {
    return answer.map((optionId) => getOptionText(question, optionId)).join(", ");
  }

  if (answer && typeof answer === "object") {
    return Object.entries(answer as Record<string, string>)
      .map(([leftId, rightId]) => {
        const leftText = getOptionText(question, leftId);
        const rightText = getOptionText(question, rightId);
        return `${leftText} -> ${rightText}`;
      })
      .join("; ");
  }

  return String(answer);
}

export function useExamSummary({
  questions,
  answers,
  flaggedQuestions,
  onConfirmSubmit,
}: UseExamSummaryParams) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const answeredCount = countAnsweredQuestions(answers);
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestions.length;

  const handleFinishClick = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onConfirmSubmit();
  };

  const isQuestionFlagged = (questionId: string) => flaggedQuestions.includes(questionId);
  const isQuestionAnswered = (questionId: string) =>
    hasMeaningfulAnswer(answers[questionId] ?? null);
  const getAnswerPreview = (question: ExamQuestion, answer: QuestionAnswer) =>
    buildAnswerPreview(question, answer);

  return {
    answeredCount,
    unansweredCount,
    flaggedCount,
    showConfirmModal,
    handleFinishClick,
    handleCloseConfirmModal,
    handleConfirmSubmit,
    isQuestionFlagged,
    isQuestionAnswered,
    getAnswerPreview,
  };
}
