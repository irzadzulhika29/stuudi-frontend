"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

interface Member {
  name: string;
}

interface AddParticipantRequest {
  leader_name: string;
  team_name: string;
  school: string;
  members: Member[];
}

interface AddParticipantResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    team_name: string;
    leader_name: string;
    school: string;
  };
}

export function useAddParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddParticipantRequest): Promise<AddParticipantResponse> => {
      const response = await api.post(API_ENDPOINTS.TEACHER.ADD_PARTICIPANT, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate any participant-related queries
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export type { AddParticipantRequest, AddParticipantResponse, Member };
