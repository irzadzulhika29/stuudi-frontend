import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

interface DeleteTopicResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation<DeleteTopicResponse, Error, string>({
    mutationFn: async (topicId: string) => {
      const response = await api.delete<DeleteTopicResponse>(
        API_ENDPOINTS.TEACHER.DELETE_TOPIC(topicId)
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate teaching courses to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourseDetails"] });
    },
  });
}
