export interface Teacher {
  name: string;
  avatar?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}
export interface CourseInfoSidebarProps {
  progress: { current: number; total: number };
  teachers?: Teacher[];
  participants?: Participant[];
  totalParticipants?: number;
  lastAccessed?: string;
  notes?: Note[];
  courseId?: string;
  topicId?: string;
  showPeople?: boolean;
  showLastAccessed?: boolean;
  readOnly?: boolean;
  openNoteId?: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  materialId?: string;
  materialName?: string;
  topicId?: string;
  topicName?: string;
}

export interface CourseNotesProps {
  notes: Note[];
  onAddNote?: (title: string, content: string) => void;
  onEditNote?: (id: string, title: string, content: string) => void;
  onDeleteNote?: (id: string) => void;
  level?: "course" | "topic" | "material";
  readOnly?: boolean;
}

export interface QuizOption {
  option_id: string;
  option_text: string;
  sequence: number;
}

import { SharedQuestion, QuestionAnswer, QuestionType } from "@/shared/types/questionTypes";

export interface QuizQuestion extends SharedQuestion {
  correctAnswer?: number;
}

export interface QuizAttempt {
  completionPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number;
}

export interface QuizAttemptHistory {
  attempt_id: string;
  content_id: string;
  content_title: string;
  course_id: string;
  course_name: string;
  topic_id: string;
  topic_name: string;
  status: "completed" | "failed" | "in_progress";
  started_at: string;
  submitted_at?: string;
  score: number;
  time_limit_minutes: number;
  time_elapsed_minutes: number;
  time_remaining_minutes: number;
  total_questions: number;
  answered_questions: number;
  progress_percentage: number;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  questions?: QuizQuestion[];
  previousAttempt?: QuizAttempt;
  lastAttemptId?: string;
}

export interface QuizStartResponse {
  attempt_id: string;
  content_id: string;
  content_title: string;
  total_questions: number;
  time_limit_minutes: number;
  passing_score: number;
  started_at: string;
  questions: {
    question_id: string;
    question_text: string;
    question_type: QuestionType;
    difficulty: string;
    points: number;
    image_url: string | null;
    sequence: number;
    options: {
      option_id: string;
      option_text: string;
      sequence: number;
    }[];
  }[];
  answers?: {
    question_id: string;
    selected_option_id: string;
  }[];
}

export interface QuizResultResponse {
  attempt_id: string;
  content_id: string;
  content_title: string;
  score: number;
  passing_score: number;
  status: "passed" | "failed";
  correct_answers: number;
  total_questions: number;
  average_answer_time?: string;
  exp_gained?: number;
  total_exp?: number;
  started_at: string;
  finished_at: string;
  time_taken: string;
  question_results: {
    question_id: string;
    question_text: string;
    question_type: QuestionType;
    is_correct: boolean;
    points_earned: number;
    max_points: number;
    your_answer: string;
    correct_answer: string;
    explanation: string;
  }[];
}

export interface QuizAnswerResponse {
  answer_id: string;
  question_id: string;
  is_correct: boolean;
  points_earned: number;
  max_points: number;
  correct_option_id?: string;
}

export type QuizStatus = "start" | "in-progress" | "summary";

export interface QuizState {
  status: QuizStatus;
  currentQuestion: number;
  answers: QuestionAnswer[];
  correctCount: number;
  startTime: number;
  questionTimes: number[];
}
