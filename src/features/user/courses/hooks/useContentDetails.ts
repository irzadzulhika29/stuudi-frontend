import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useContentDetails = (contentId: string) => {
  return useQuery({
    queryKey: ["contentDetails", contentId],
    queryFn: async () => {
      const data = await courseService.getContentDetails(contentId);
      return data;
    },
    enabled: !!contentId,
  });
};
