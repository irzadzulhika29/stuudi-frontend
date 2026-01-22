export interface ExamQuestion {
  id: number;
  text: string;
  image?: string;
  options: {
    label: string;
    text: string;
  }[];
}

export interface ExamData {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: ExamQuestion[];
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<number, string>;
  flaggedQuestions: Set<number>;
  lives: number;
  timeRemaining: number;
  isFinished: boolean;
}

export type QuestionStatus = "unanswered" | "current" | "answered" | "flagged" | "flagged-answered";
