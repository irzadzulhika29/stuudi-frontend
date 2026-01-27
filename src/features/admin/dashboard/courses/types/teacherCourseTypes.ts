export interface TeachingCourse {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  enrollment_code: string;
  student_count: number;
  created_at: string;
}

export interface TeachingCoursesData {
  courses: TeachingCourse[];
  total: number;
}

export interface TeachingCoursesResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: TeachingCoursesData;
}

export interface AddCourseRequest {
  name: string;
  description: string;
  photo: File;
}

export interface AddCourseData {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  enrollment_code: string;
}

export interface AddCourseResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: AddCourseData;
}

export interface TeachingContent {
  content_id: string;
  title: string;
  type: string;
  is_completed: boolean;
  sequence: number;
}

export interface TeachingTopic {
  topic_id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  contents: TeachingContent[];
}

export interface TeachingParticipant {
  user_id: string;
  name: string;
}

export interface TeachingProgress {
  current_exp: number;
  total_exp: number;
  percentage: number;
}

export interface TeachingCourseDetails {
  course_id: string;
  name: string;
  description: string;
  image_url: string;
  enrollment_code: string;
  progress: TeachingProgress;
  topics: TeachingTopic[] | null;
  teachers: { user_id: string; name: string }[];
  participants: TeachingParticipant[];
  total_participants: number;
  last_accessed: string | null;
}
