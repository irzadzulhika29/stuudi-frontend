"use client";

// Quiz Question Types
export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "matching";

// Quiz Option for multiple choice / true-false
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Matching Pair for matching questions
export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

// Base quiz data shared by all question types
export interface BaseQuizData {
  question: string;
  questionType: QuestionType;
  isRequired: boolean;
  points: number;
  imageUrl?: string;
}

// Multiple Choice specific data
export interface MultipleChoiceData extends BaseQuizData {
  questionType: "multiple_choice";
  isMultipleAnswer: boolean;
  options: QuizOption[];
}

// True/False specific data
export interface TrueFalseData extends BaseQuizData {
  questionType: "true_false";
  correctAnswer: boolean;
}

// Short Answer specific data
export interface ShortAnswerData extends BaseQuizData {
  questionType: "short_answer";
  expectedAnswer: string;
  caseSensitive: boolean;
}

// Matching specific data
export interface MatchingData extends BaseQuizData {
  questionType: "matching";
  pairs: MatchingPair[];
}

// Union type for all quiz data
export type QuizData = MultipleChoiceData | TrueFalseData | ShortAnswerData | MatchingData;

// Base props for question components
export interface BaseQuestionProps {
  id: string;
  question: string;
  points: number;
  isRequired: boolean;
  onQuestionChange: (question: string) => void;
  onPointsChange: (points: number) => void;
}

// Multiple Choice props
export interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: QuizOption[];
  isMultipleAnswer: boolean;
  onOptionsChange: (options: QuizOption[]) => void;
  onMultipleAnswerToggle: () => void;
}

// True/False props
export interface TrueFalseQuestionProps extends BaseQuestionProps {
  correctAnswer: boolean;
  onCorrectAnswerChange: (value: boolean) => void;
}

// Short Answer props
export interface ShortAnswerQuestionProps extends BaseQuestionProps {
  expectedAnswer: string;
  caseSensitive: boolean;
  onExpectedAnswerChange: (value: string) => void;
  onCaseSensitiveToggle: () => void;
}

// Matching props
export interface MatchingQuestionProps extends BaseQuestionProps {
  pairs: MatchingPair[];
  onPairsChange: (pairs: MatchingPair[]) => void;
}
