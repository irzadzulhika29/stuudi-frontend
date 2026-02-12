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
    // Handle matching questions
    if (q.question_type === "matching") {
      // Group options by matching_pair ID to reconstruct pairs
      const pairMap = new Map<string, { left: string; right: string }>();

      for (const opt of q.options) {
        if (!opt.matching_pair || !opt.side) continue;

        const existing = pairMap.get(opt.matching_pair) || { left: "", right: "" };
        if (opt.side === "left") {
          existing.left = opt.option_text;
        } else if (opt.side === "right") {
          existing.right = opt.option_text;
        }
        pairMap.set(opt.matching_pair, existing);
      }

      // Sort pairs by the minimum sequence of their options
      const pairEntries = Array.from(pairMap.entries());
      const pairSequences = new Map<string, number>();
      for (const opt of q.options) {
        if (!opt.matching_pair) continue;
        const current = pairSequences.get(opt.matching_pair);
        if (current === undefined || opt.sequence < current) {
          pairSequences.set(opt.matching_pair, opt.sequence);
        }
      }
      pairEntries.sort((a, b) => (pairSequences.get(a[0]) || 0) - (pairSequences.get(b[0]) || 0));

      return {
        id: q.question_id,
        data: {
          question: q.question_text,
          questionType: "matching" as const,
          isRequired: true,
          difficulty: q.difficulty,
          pairs: pairEntries.map(([pairId, pair]) => ({
            id: pairId,
            left: pair.left,
            right: pair.right,
          })),
        },
      };
    }

    // Handle single/multiple choice questions
    return {
      id: q.question_id,
      data: {
        question: q.question_text,
        questionType: q.question_type,
        isRequired: true,
        difficulty: q.difficulty,
        options: q.options
          .sort((a, b) => a.sequence - b.sequence)
          .map((opt) => ({
            id: opt.option_id,
            text: opt.option_text,
            isCorrect: opt.is_correct || false,
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
