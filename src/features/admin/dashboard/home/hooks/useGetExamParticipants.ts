"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ExamParticipant, ExamParticipantsResponse } from "../types/examParticipantsTypes";

export const useGetExamParticipants = (examId: string) => {
  return useQuery<ExamParticipant[]>({
    queryKey: ["examParticipants", examId],
    queryFn: async () => {
      const response = await api.get<ExamParticipantsResponse>(
        API_ENDPOINTS.TEACHER.GET_EXAM_PARTICIPANTS(examId)
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
