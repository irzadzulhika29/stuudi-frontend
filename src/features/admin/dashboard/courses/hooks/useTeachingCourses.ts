import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { TeachingCoursesData, TeachingCoursesResponse } from "../types/teacherCourseTypes";

export const useTeachingCourses = () => {
  return useQuery<TeachingCoursesData>({
    queryKey: ["teachingCourses"],
    queryFn: async () => {
      console.log("Fetching teaching courses...");
      console.log("Endpoint:", API_ENDPOINTS.TEACHER.COURSES);
      const response = await api.get<TeachingCoursesResponse>(API_ENDPOINTS.TEACHER.COURSES);
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

