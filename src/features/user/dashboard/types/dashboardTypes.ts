export interface UpcomingExam {
  title: string;
  start_at: string;
}

export interface ExamAccessData {
  exam_id: string;
  course_id: string;
  course_name: string;
  title: string;
  description: string;
  duration: number;
  passing_score: number;
  total_questions: number;
  start_time: string;
  end_time: string;
  max_attempts: number;
  attempts_used: number;
  attempts_left: number;
  can_start: boolean;
  message: string;
}

export interface QuestionOption {
  option_id: string;
  option_text: string;
  side?: "left" | "right";
  matching_pair?: string;
  sequence: number;
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: "matching" | "multiple" | "single" | "short_answer" | "true_false";
  points: number;
  sequence: number;
  options: QuestionOption[];
  saved_answer?: string | number | string[] | Record<string, string> | null;
}

export interface ExamStartResponse {
  attempt_id: string;
  exam_id: string;
  title: string;
  duration: number;
  started_at: string;
  ends_at: string;
  questions: Question[];
  lives_info: {
    is_disqualified: boolean;
    lives_remaining: number;
    tab_switches: number;
  };
}

export interface ExamAttempt {
  attempt_id: string;
  exam_id: string;
  exam_title: string;
  course_id: string;
  course_name: string;
  score: number;
  passing_score: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
  ends_at?: string;
  ended_at?: string;
}

export interface ExamAttemptsResponse {
  attempts: ExamAttempt[];
  total: number;
}

export interface ExamResumeResponse extends ExamStartResponse {
  time_remaining: number;
}
