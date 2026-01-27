"use client";

export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "matching";

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

export interface MultipleChoiceData extends BaseQuizData {
  questionType: "multiple_choice";
  isMultipleAnswer: boolean;
  options: QuizOption[];
}

export interface TrueFalseData extends BaseQuizData {
  questionType: "true_false";
  correctAnswer: boolean;
}

export interface ShortAnswerData extends BaseQuizData {
  questionType: "short_answer";
  expectedAnswer: string;
  caseSensitive: boolean;
}

export interface MatchingData extends BaseQuizData {
  questionType: "matching";
  pairs: MatchingPair[];
}

export type QuizData = MultipleChoiceData | TrueFalseData | ShortAnswerData | MatchingData;

export interface BaseQuestionProps {
  id: string;
  question: string;
  difficulty: QuizDifficulty;
  isRequired: boolean;
  onQuestionChange: (question: string) => void;
  onDifficultyChange: (difficulty: QuizDifficulty) => void;
}

export interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: QuizOption[];
  isMultipleAnswer: boolean;
  onOptionsChange: (options: QuizOption[]) => void;
  onMultipleAnswerToggle: () => void;
}

export interface TrueFalseQuestionProps extends BaseQuestionProps {
  correctAnswer: boolean;
  onCorrectAnswerChange: (value: boolean) => void;
}

export interface ShortAnswerQuestionProps extends BaseQuestionProps {
  expectedAnswer: string;
  caseSensitive: boolean;
  onExpectedAnswerChange: (value: string) => void;
  onCaseSensitiveToggle: () => void;
}

export interface MatchingQuestionProps extends BaseQuestionProps {
  pairs: MatchingPair[];
  onPairsChange: (pairs: MatchingPair[]) => void;
}
