import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { AddCourseRequest, AddCourseResponse, AddCourseData } from "../types/teacherCourseTypes";

export const useAddCourse = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AddCourseData, AxiosError<ApiError>, AddCourseRequest>({
    mutationFn: async (data: AddCourseRequest) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("photo", data.photo);

      const response = await api.post<AddCourseResponse>(
        API_ENDPOINTS.TEACHER.ADD_COURSE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
      router.push("/dashboard-admin/courses");
    },
    onError: (error) => {
      console.error("Failed to add course:", error);
    },
  });
};
