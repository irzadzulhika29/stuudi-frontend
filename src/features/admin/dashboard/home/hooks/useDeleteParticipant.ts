"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

interface DeleteParticipantResponse {
  success: boolean;
  message?: string;
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string): Promise<DeleteParticipantResponse> => {
      const response = await api.delete(API_ENDPOINTS.TEACHER.DELETE_PARTICIPANT(userId));
      return response.data;
    },
    onSuccess: () => {
      // Invalidate any participant-related queries
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
    },
  });
}

export type { DeleteParticipantResponse };
