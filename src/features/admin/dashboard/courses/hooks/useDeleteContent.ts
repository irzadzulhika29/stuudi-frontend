import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

interface DeleteContentResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation<DeleteContentResponse, AxiosError<ApiError>, string>({
    mutationFn: async (contentId: string) => {
      const response = await api.delete<DeleteContentResponse>(
        API_ENDPOINTS.TEACHER.DELETE_CONTENT(contentId)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });
    },
  });
}
