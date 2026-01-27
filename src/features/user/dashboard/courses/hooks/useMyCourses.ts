import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: () => courseService.getMyCourses(),
  });
};
