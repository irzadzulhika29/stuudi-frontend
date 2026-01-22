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
    showPeople?: boolean;
    showLastAccessed?: boolean;
    enrollCode?: string;
}

export interface Note {
    id: string;
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
    onAddNote?: (content: string) => void;
    onEditNote?: (id: string, content: string) => void;
    onDeleteNote?: (id: string) => void;
    level?: "course" | "topic" | "material";
}

export interface QuizQuestion {
    id: string;
    question: string;
    image?: string;
    options: string[];
    correctAnswer: number;
}

export interface QuizAttempt {
    completionPoints: number;
    correctAnswers: number;
    totalQuestions: number;
    averageTime: number;
}

export interface QuizData {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    previousAttempt?: QuizAttempt;
}

export type QuizStatus = "start" | "in-progress" | "summary";

export interface QuizState {
    status: QuizStatus;
    currentQuestion: number;
    answers: (number | null)[];
    correctCount: number;
    startTime: number;
    questionTimes: number[];
}