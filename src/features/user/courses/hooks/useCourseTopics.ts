import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useCourseTopics = (courseId: string) => {
  return useQuery({
    queryKey: ["courseTopics", courseId],
    queryFn: async () => {
      console.log("Fetching course topics for:", courseId);
      const data = await courseService.getCourseTopics(courseId);
      console.log("Course topics data:", data);
      return data;
    },
    enabled: !!courseId,
  });
};
