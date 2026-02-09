import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useCourseTopics = (courseId: string) => {
  return useQuery({
    queryKey: ["courseTopics", courseId],
    queryFn: async () => {
      const data = await courseService.getCourseTopics(courseId);
      return data;
    },
    enabled: !!courseId,
  });
};
