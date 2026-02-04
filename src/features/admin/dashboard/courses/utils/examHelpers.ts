import { ExamDetails } from "../hooks/useGetExamDetails";
import { QuizItem } from "../types";

/**
 * Format ISO date string to datetime-local input format
 * @param isoString - ISO format date string
 * @returns Formatted datetime string for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

/**
 * Transform API exam questions to QuizItem format
 * @param examDetails - Exam details from API
 * @returns Array of QuizItem
 */
export function transformApiQuestionsToQuizItems(examDetails: ExamDetails): QuizItem[] {
  return examDetails.questions.map((q) => {
    const questionType =
      q.question_type === "single" || q.question_type === "multiple" ? q.question_type : "single";

    return {
      id: q.question_id,
      data: {
        question: q.question_text,
        questionType: questionType,
        isRequired: true,
        difficulty: q.difficulty,
        options: q.options
          .sort((a, b) => a.sequence - b.sequence)
          .map((opt) => ({
            id: opt.option_id,
            text: opt.option_text,
            isCorrect: opt.is_correct,
          })),
      },
    };
  });
}

/**
 * Check if a string is a valid UUID format
 * @param id - String to check
 * @returns True if valid UUID, false otherwise
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
