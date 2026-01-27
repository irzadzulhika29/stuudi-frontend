import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

interface AddContentRequest {
  title: string;
  type: "materi";
}

interface AddContentResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    content_id: string;
    title: string;
  };
}

export const useAddContent = (topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddContentResponse, AxiosError<ApiError>, AddContentRequest>({
    mutationFn: async (data: AddContentRequest) => {
      const response = await api.post<AddContentResponse>(
        API_ENDPOINTS.TEACHER.ADD_CONTENT(topicId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate topic details to refetch materials
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });
    },
  });
};
