import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { TeachingCourseDetails } from "../types/teacherCourseTypes";

export const useTeachingCourseDetails = (courseId: string) => {
  return useQuery<TeachingCourseDetails>({
    queryKey: ["teachingCourse", courseId],
    queryFn: async () => {
      console.log("Fetching teaching course details for:", courseId);
      const response = await api.get<ApiResponse<TeachingCourseDetails>>(
        API_ENDPOINTS.TEACHER.COURSE_DETAIL(courseId)
      );
      console.log("Teaching course details response:", response.data);
      return response.data.data;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};
