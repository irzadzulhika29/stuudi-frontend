"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface CourseExam {
  exam_id: string;
  exam_name: string;
  description: string;
}

interface GetCourseExamsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: CourseExam[];
}

export const useGetCourseExams = (courseId: string) => {
  return useQuery<CourseExam[]>({
    queryKey: ["courseExams", courseId],
    queryFn: async () => {
      const response = await api.get<GetCourseExamsResponse>(
        API_ENDPOINTS.TEACHER.GET_COURSE_EXAMS(courseId)
      );
      return response.data.data;
    },
    enabled: !!courseId,
  });
};
