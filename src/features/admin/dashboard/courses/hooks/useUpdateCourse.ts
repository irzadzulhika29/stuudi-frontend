import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

export interface UpdateCourseRequest {
  name: string;
  description: string;
  photo?: File | null;
}

interface UpdateCourseResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    course_id: string;
    name: string;
    description: string;
    image_url: string;
    enrollment_code: string;
    updated_at: string;
  };
}

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCourseResponse, AxiosError<ApiError>, UpdateCourseRequest>({
    mutationFn: async (data: UpdateCourseRequest) => {
      console.log("useUpdateCourse: Sending request...", data);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      console.log(
        "useUpdateCourse: FormData created. Name:",
        data.name,
        "Desc:",
        data.description,
        "Photo:",
        data.photo ? "Yes" : "No"
      );

      const response = await api.patch<UpdateCourseResponse>(
        API_ENDPOINTS.TEACHER.UPDATE_COURSE(courseId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("useUpdateCourse: Response received", response.data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate course details
      queryClient.invalidateQueries({ queryKey: ["teachingCourse", courseId] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
    },
  });
};
