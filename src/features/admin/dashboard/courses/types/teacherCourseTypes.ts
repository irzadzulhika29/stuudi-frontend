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

