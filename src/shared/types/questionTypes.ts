export type QuestionType = "single" | "multiple" | "matching" | "short_answer" | "true_false";

export interface SharedQuestionOption {
  id: string;
  text: string;
  sequence?: number;
  side?: "left" | "right"; // For matching
  matchingPair?: string; // For matching logic (if needed for rendering connections, though usually answer state handles this)
}

export interface SharedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  image?: string | null;
  points?: number;
  options: SharedQuestionOption[];
}

// Flexible type for answers: single (string ID), multiple (string[] IDs), matching (Record<string, string>), etc.
export type QuestionAnswer = string | string[] | Record<string, string> | number | null;

// Props for the renderer components
export interface QuestionRendererProps {
  question: SharedQuestion;
  selectedAnswer: QuestionAnswer;
  onSelectAnswer: (answer: QuestionAnswer) => void;
  disabled?: boolean;
  isCorrect?: boolean;
  correctAnswerId?: string;
}
