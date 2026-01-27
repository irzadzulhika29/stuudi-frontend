import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";
import { AxiosError } from "axios";

interface DeleteCourseResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: null;
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCourseResponse, AxiosError<ApiError>, string>({
    mutationFn: async (courseId: string) => {
      console.log("Deleting course:", courseId);
      const response = await api.delete<DeleteCourseResponse>(
        API_ENDPOINTS.TEACHER.DELETE_COURSE(courseId)
      );
      console.log("Delete course response:", response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
    },
  });
};
