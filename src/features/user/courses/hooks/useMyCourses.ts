import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: () => courseService.getMyCourses(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
