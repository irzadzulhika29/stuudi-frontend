import { QuestionAnswer } from "@/shared/types/questionTypes";

export interface QuestionOption {
  option_id: string;
  option_text: string;
  side?: "left" | "right";
  matching_pair?: string;
  sequence: number;
}

export interface ExamQuestion {
  question_id: string;
  question_text: string;
  question_type: "matching" | "multiple" | "single" | "short_answer" | "true_false";
  points: number;
  options: QuestionOption[];
  question_image?: string; // mapped from API image if exists, or optional
}

export interface ExamData {
  exam_id: string;
  title: string;
  subject?: string; // API might not return subject directly in start response, but tile usually has it
  duration: number;
  questions: ExamQuestion[];
  attempt_id?: string;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<string, QuestionAnswer>; // question_id -> answer (string or object)
  flaggedQuestions: string[]; // question_ids
  lives: number;
  maxLives: number;
  timeRemaining: number;
  isFinished: boolean;
  isInitialized: boolean;
  examData?: ExamData;
  view: "intro" | "exam" | "summary" | "finished";
}

export type QuestionStatus = "unanswered" | "current" | "answered" | "flagged" | "flagged-answered";
