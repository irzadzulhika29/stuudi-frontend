import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { AxiosError } from "axios";

export interface AddTopicRequest {
  title: string;
  description: string;
}

export interface AddTopicData {
  topic_id: string;
  title: string;
  description: string;
  sequence: number;
  created_at: string;
}

export interface AddTopicResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: AddTopicData;
}

export const useAddTopic = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddTopicResponse, AxiosError<ApiError>, AddTopicRequest>({
    mutationFn: async (data: AddTopicRequest) => {
      const response = await api.post<AddTopicResponse>(
        API_ENDPOINTS.TEACHER.ADD_TOPIC(courseId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate course details to refetch topics
      queryClient.invalidateQueries({ queryKey: ["teachingCourse", courseId] });
    },
  });
};
