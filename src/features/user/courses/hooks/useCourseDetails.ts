import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      console.log("Fetching student course details for:", courseId);
      const data = await courseService.getCourseDetails(courseId);
      console.log("Student course details data:", data);
      return data;
    },
    enabled: !!courseId,
  });
};
