import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useContentDetails = (contentId: string) => {
  return useQuery({
    queryKey: ["contentDetails", contentId],
    queryFn: async () => {
      console.log("Fetching content details for:", contentId);
      const data = await courseService.getContentDetails(contentId);
      console.log("Content details data:", data);
      return data;
    },
    enabled: !!contentId,
  });
};
