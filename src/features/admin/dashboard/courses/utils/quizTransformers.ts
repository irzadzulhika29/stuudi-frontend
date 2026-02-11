import { QuizItem } from "../containers/QuizFormContainer";
import { QuizOption } from "../components/quiz/types";

// Type untuk API request
export interface QuizQuestionApiFormat {
  question_text: string;
  question_type: "single" | "multiple" | "matching";
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  options?: Array<{ text: string; is_correct: boolean }>;
  matching_pairs?: Array<{ left_text: string; right_text: string }>;
}

// Type untuk API response (flexible untuk handle berbagai format)
export interface ApiQuestionResponse {
  question_text?: string;
  text?: string;
  type?: "single" | "multiple" | "matching";
  question_type?: "single" | "multiple" | "matching";
  difficulty?: "easy" | "medium" | "hard";
  options?: Array<{
    option_id?: string;
    id?: string;
    text?: string;
    option_text?: string;
    is_correct?: boolean;
  }>;
  pairs?: Array<{
    pair_id?: string;
    id?: string;
    left?: string;
    right?: string;
  }>;
  matching_pairs?: Array<{
    pair_id?: string;
    id?: string;
    left_text?: string;
    right_text?: string;
  }>;
}

/**
 * Transform quiz item dari format internal ke format API
 */
export function transformQuizItemToApiFormat(item: QuizItem): QuizQuestionApiFormat {
  const baseData = {
    question_text: item.data.question,
    difficulty: item.data.difficulty,
    explanation: "",
  };

  // Untuk soal pilihan ganda (single atau multiple)
  if (item.data.questionType === "single" || item.data.questionType === "multiple") {
    return {
      ...baseData,
      question_type: item.data.questionType,
      options: (item.data.options || []).map((opt) => ({
        text: opt.text,
        is_correct: opt.isCorrect,
      })),
    };
  }

  // Untuk soal matching
  if (item.data.questionType === "matching") {
    return {
      ...baseData,
      question_type: "matching",
      matching_pairs:
        item.data.pairs?.map((pair) => ({
          left_text: pair.left,
          right_text: pair.right,
        })) || [],
    };
  }

  // Fallback (shouldn't reach here with new types)
  throw new Error(`Unsupported question type: ${item.data.questionType}`);
}

/**
 * Generate default quiz item berdasarkan type
 */
export function generateDefaultQuizItem(type: "single" | "multiple" | "matching"): QuizItem {
  const id = `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const baseData = {
    question: "",
    isRequired: true,
    difficulty: "easy" as const,
  };

  if (type === "single" || type === "multiple") {
    return {
      id,
      data: {
        ...baseData,
        questionType: type,
        options: [
          { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-2`, text: "", isCorrect: type === "single" },
          { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-4`, text: "", isCorrect: false },
        ],
      },
    };
  }

  // Matching type
  return {
    id,
    data: {
      ...baseData,
      questionType: "matching",
      options: [], // Empty options for matching type
      pairs: [
        { id: `pair-${Date.now()}-1`, left: "", right: "" },
        { id: `pair-${Date.now()}-2`, left: "", right: "" },
      ],
    },
  };
}

/**
 * Transform API response ke quiz item format (untuk edit mode)
 * Handles multiple API response formats
 */
export function transformApiToQuizItem(
  apiQuestion: ApiQuestionResponse,
  questionId: string
): QuizItem {
  // Handle both "question_text" and "text" field names
  const questionText = apiQuestion.question_text || apiQuestion.text || "";

  // Handle both "type" and "question_type" field names
  const apiType = apiQuestion.type || apiQuestion.question_type;

  const baseData = {
    question: questionText,
    isRequired: true,
    difficulty: apiQuestion.difficulty || ("easy" as const),
  };

  // Prioritas 1: Jika API secara eksplisit menyatakan tipe "matching"
  if (apiType === "matching") {
    // Cek matching_pairs (format baru) terlebih dahulu
    if (
      apiQuestion.matching_pairs &&
      Array.isArray(apiQuestion.matching_pairs) &&
      apiQuestion.matching_pairs.length > 0
    ) {
      return {
        id: questionId,
        data: {
          ...baseData,
          questionType: "matching" as const,
          pairs: apiQuestion.matching_pairs.map((pair, index: number) => ({
            id: pair.pair_id || pair.id || `pair-${questionId}-${index}`,
            left: pair.left_text || "",
            right: pair.right_text || "",
          })),
        },
      };
    }

    // Fallback ke pairs (format lama)
    if (apiQuestion.pairs && Array.isArray(apiQuestion.pairs) && apiQuestion.pairs.length > 0) {
      return {
        id: questionId,
        data: {
          ...baseData,
          questionType: "matching" as const,
          pairs: apiQuestion.pairs.map((pair, index: number) => ({
            id: pair.pair_id || pair.id || `pair-${questionId}-${index}`,
            left: pair.left || "",
            right: pair.right || "",
          })),
        },
      };
    }

    // Fallback: Backend mengembalikan matching data sebagai options
    // Rekonstruksi pairs dari options (first half = left, second half = right)
    if (
      apiQuestion.options &&
      Array.isArray(apiQuestion.options) &&
      apiQuestion.options.length >= 2 &&
      apiQuestion.options.length % 2 === 0
    ) {
      const half = apiQuestion.options.length / 2;
      const leftOptions = apiQuestion.options.slice(0, half);
      const rightOptions = apiQuestion.options.slice(half);

      return {
        id: questionId,
        data: {
          ...baseData,
          questionType: "matching" as const,
          pairs: leftOptions.map((leftOpt, index: number) => ({
            id: `pair-${questionId}-${index}`,
            left: leftOpt.text || leftOpt.option_text || "",
            right: rightOptions[index]?.text || rightOptions[index]?.option_text || "",
          })),
        },
      };
    }

    // Jika matching tapi tidak ada pairs maupun options, buat default pairs
    return {
      id: questionId,
      data: {
        ...baseData,
        questionType: "matching" as const,
        pairs: [
          { id: `pair-${questionId}-0`, left: "", right: "" },
          { id: `pair-${questionId}-1`, left: "", right: "" },
        ],
      },
    };
  }

  // Prioritas 2: Jika ada options, berarti single atau multiple choice
  if (apiQuestion.options && Array.isArray(apiQuestion.options) && apiQuestion.options.length > 0) {
    // Determine question type from API or by counting correct answers
    let questionType: "single" | "multiple";

    if (apiType === "single" || apiType === "multiple") {
      questionType = apiType;
    } else {
      // Fallback: count correct answers
      const hasMultipleCorrect = apiQuestion.options.filter((opt) => opt.is_correct).length > 1;
      questionType = hasMultipleCorrect ? "multiple" : "single";
    }

    return {
      id: questionId,
      data: {
        ...baseData,
        questionType,
        options: apiQuestion.options.map((opt, index: number) => ({
          // Handle both "id" and "option_id" field names
          id: opt.option_id || opt.id || `opt-${questionId}-${index}`,
          text: opt.text || opt.option_text || "",
          isCorrect: opt.is_correct || false,
        })),
      },
    };
  }

  // Prioritas 3: Jika ada matching_pairs (format baru) tanpa apiType, berarti matching
  if (
    apiQuestion.matching_pairs &&
    Array.isArray(apiQuestion.matching_pairs) &&
    apiQuestion.matching_pairs.length > 0
  ) {
    return {
      id: questionId,
      data: {
        ...baseData,
        questionType: "matching" as const,
        pairs: apiQuestion.matching_pairs.map((pair, index: number) => ({
          id: pair.pair_id || pair.id || `pair-${questionId}-${index}`,
          left: pair.left_text || "",
          right: pair.right_text || "",
        })),
      },
    };
  }

  // Prioritas 4: Jika ada pairs (format lama), berarti matching
  if (apiQuestion.pairs && Array.isArray(apiQuestion.pairs) && apiQuestion.pairs.length > 0) {
    return {
      id: questionId,
      data: {
        ...baseData,
        questionType: "matching" as const,
        pairs: apiQuestion.pairs.map((pair, index: number) => ({
          id: pair.pair_id || pair.id || `pair-${questionId}-${index}`,
          left: pair.left || "",
          right: pair.right || "",
        })),
      },
    };
  }

  // Default fallback ke single choice with empty options
  console.warn(
    `Question ${questionId} has no valid options or pairs, creating default single choice`
  );
  return generateDefaultQuizItem("single");
}

/**
 * Helper untuk menghitung jumlah jawaban benar dalam options
 */
export function countCorrectAnswers(options: QuizOption[]): number {
  return options.filter((opt) => opt.isCorrect).length;
}

/**
 * Helper untuk validasi bahwa minimal ada options atau pairs
 */
export function hasValidContent(item: QuizItem): boolean {
  if (item.data.questionType === "single" || item.data.questionType === "multiple") {
    return !!(item.data.options && item.data.options.length > 0);
  }

  if (item.data.questionType === "matching") {
    return !!(item.data.pairs && item.data.pairs.length > 0);
  }

  return false;
}
