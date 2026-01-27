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
}
