export interface Course {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  enrollment_code: string;
  student_count: number;
  is_enrolled: boolean;
  progress_percentage: number;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface BrowseCoursesResponse {
  courses: Course[];
  pagination: PaginationMeta;
}

export interface MyCoursesResponse {
  courses: Course[];
  total: number;
}

export interface BrowseCoursesRequest {
  page: number;
  per_page: number;
  search: string;
}

export interface Teacher {
  user_id: string;
  name: string;
}

export interface Participant {
  user_id: string;
  name: string;
}

export interface CourseProgress {
  current_exp: number;
  total_exp: number;
  percentage: number;
}

export interface Material {
  id: string;
  title: string;
  isCompleted: boolean;
}

// API response types (raw from backend)
export interface ApiTopicContent {
  content_id: string;
  title: string;
  is_completed: boolean;
  sequence: number;
  type: "materi" | "quiz";
  total_blocks: number;
}

export interface ApiTopic {
  topic_id: string;
  title: string;
  description: string;
  status: "unlocked" | "locked" | "completed";
  is_completed: boolean;
  sequence: number;
  completed_contents: number;
  total_contents: number;
  contents: ApiTopicContent[];
}

// Transformed types (used in components)
export interface Topic {
  topic_id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  materials: Material[];
}

export interface Exam {
  exam_id: string;
  title: string;
}

// API response type (raw from backend)
export interface ApiCourseDetails {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  progress: CourseProgress;
  topics: ApiTopic[] | null;
  exam: Exam | null;
  teachers: Teacher[];
  participants: Participant[];
  total_participants: number;
  last_accessed: string | null;
  my_notes: Note[] | null;
}

// Transformed type (used in components)
export interface CourseDetails {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  progress: CourseProgress;
  topics: Topic[] | null;
  exam: Exam | null;
  teachers: Teacher[];
  participants: Participant[];
  total_participants: number;
  last_accessed: string | null;
  my_notes: Note[] | null;
}

// API response for GET /student/courses/{courseId}/topics
export interface ApiCourseTopicsResponse {
  course_id: string;
  course_name: string;
  topics: ApiTopic[] | null;
}

// Transformed type for course topics
export interface CourseTopics {
  course_id: string;
  course_name: string;
  topics: Topic[];
}

// API response for GET /student/content/{contentId}
export interface ApiContentDetails {
  content_id: string;
  title: string;
  type: "materi" | "quiz";
  sequence: number;
  topic_id: string;
  topic_name: string;
  is_completed: boolean;
  blocks: ApiContentBlock[] | null;
  last_attempt_id?: string;
}

// API Content block types (raw from backend)
export interface ApiContentBlock {
  block_id: string;
  type: "text" | "media" | "quiz";
  sequence: number;
  // Text block fields
  text_content?: string;
  // Media block fields
  media_url?: string;
  media_type?: "image" | "video" | "audio" | "document";
  caption?: string;
  // Quiz block fields
  questions?: ApiQuizQuestion[];
}

export interface ApiQuizQuestion {
  question_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "matching";
  points: number;
  options?: ApiQuizOption[];
}

export interface ApiQuizOption {
  option_id: string;
  option_text: string;
  is_correct?: boolean;
}

// Transformed types (used in components)
export interface ContentBlock {
  blockId: string;
  type: "text" | "media" | "quiz";
  sequence: number;
  // Text block
  textContent?: string;
  // Media block
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio" | "document";
  caption?: string;
  // Quiz block
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "matching";
  points: number;
  options: QuizOption[];
}

export interface QuizOption {
  optionId: string;
  optionText: string;
  isCorrect?: boolean;
}

// Transformed type for content details (used in components)
export interface ContentDetails {
  contentId: string;
  title: string;
  type: "materi" | "quiz";
  sequence: number;
  topicId: string;
  topicName: string;
  isCompleted: boolean;
  blocks: ContentBlock[];
  lastAttemptId?: string;
}

// API response for content complete/incomplete
export interface ContentCompletionResponse {
  content_id: string;
  is_completed: boolean;
  completed_at: string;
}

// Quiz check answer types
export interface CheckAnswerRequest {
  question_id: string;
  selected_option_id: string;
}

export interface CheckAnswerResponse {
  question_id: string;
  is_correct: boolean;
  correct_option_id: string;
}

// Topic Notes types
export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface Note {
  note_id: string;
  topic_id: string;
  title: string;
  content: string;
  created_at: string;
  topic_name?: string;
}
