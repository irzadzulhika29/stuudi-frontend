import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/user/courses/services/courseService";

/**
 * Hook to get courses where the teacher is enrolled as a student.
 * Uses the same API as the student enrolled courses.
 */
export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => courseService.getMyCourses(),
  });
};
