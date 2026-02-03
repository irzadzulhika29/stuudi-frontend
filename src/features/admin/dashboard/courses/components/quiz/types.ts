"use client";

// Simplified to 3 question types: single, multiple, matching
export type QuestionType = "single" | "multiple" | "matching";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface BaseQuizData {
  question: string;
  questionType: QuestionType;
  isRequired: boolean;
  difficulty: QuizDifficulty;
  imageUrl?: string;
}

// Choice Question (handles both single and multiple choice)
export interface ChoiceQuestionData extends BaseQuizData {
  questionType: "single" | "multiple";
  options: QuizOption[];
}

// Matching Question
export interface MatchingData extends BaseQuizData {
  questionType: "matching";
  pairs: MatchingPair[];
}

// Union type for all quiz data
export type QuizData = ChoiceQuestionData | MatchingData;

export interface BaseQuestionProps {
  id: string;
  question: string;
  difficulty: QuizDifficulty;
  isRequired: boolean;
  onQuestionChange: (question: string) => void;
  onDifficultyChange: (difficulty: QuizDifficulty) => void;
}

// Props for choice questions (single and multiple)
export interface ChoiceQuestionProps extends BaseQuestionProps {
  choiceType: "single" | "multiple";
  options: QuizOption[];
  onOptionsChange: (options: QuizOption[]) => void;
  onChoiceTypeChange: (type: "single" | "multiple") => void;
}

// Props for matching questions
export interface MatchingQuestionProps extends BaseQuestionProps {
  pairs: MatchingPair[];
  onPairsChange: (pairs: MatchingPair[]) => void;
}
