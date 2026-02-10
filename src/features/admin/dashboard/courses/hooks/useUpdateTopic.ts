import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

interface UpdateTopicRequest {
  title: string;
  description: string;
}

interface UpdateTopicResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    topic_id: string;
    title: string;
    description: string;
    updated_at: string;
  };
}

export const useUpdateTopic = (topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTopicResponse, AxiosError<ApiError>, UpdateTopicRequest>({
    mutationFn: async (data: UpdateTopicRequest) => {
      const response = await api.put<UpdateTopicResponse>(
        API_ENDPOINTS.TEACHER.UPDATE_TOPIC(topicId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate course details to refresh topic list
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });
    },
  });
};
