import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const data = await courseService.getCourseDetails(courseId);
      return data;
    },
    enabled: !!courseId,
  });
};
