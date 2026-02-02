"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import {
  DisqualifiedParticipantsData,
  DisqualifiedParticipantsResponse,
} from "../types/disqualifiedParticipantsTypes";

export const useGetDisqualifiedParticipants = (examId: string) => {
  return useQuery<DisqualifiedParticipantsData>({
    queryKey: ["disqualifiedParticipants", examId],
    queryFn: async () => {
      const response = await api.get<DisqualifiedParticipantsResponse>(
        API_ENDPOINTS.TEACHER.DISQUALIFIED_PARTICIPANTS(examId)
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
