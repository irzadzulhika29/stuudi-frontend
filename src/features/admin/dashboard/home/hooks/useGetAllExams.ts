"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface ExamItem {
  exam_id: string;
  title: string;
}

interface GetAllExamsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ExamItem[];
}

export const useGetAllExams = () => {
  return useQuery<ExamItem[]>({
    queryKey: ["allExams"],
    queryFn: async () => {
      const response = await api.get<GetAllExamsResponse>(API_ENDPOINTS.TEACHER.GET_ALL_EXAMS);
      return response.data.data;
    },
  });
};
