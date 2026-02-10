import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

export const useMarkContentComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => courseService.markContentComplete(contentId),
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["contentDetails", data.contentId] });
      queryClient.invalidateQueries({ queryKey: ["courseTopics"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (error) => {
      console.error("Failed to mark content as complete:", error);
    },
  });
};

export const useMarkContentIncomplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => courseService.markContentIncomplete(contentId),
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["contentDetails", data.contentId] });
      queryClient.invalidateQueries({ queryKey: ["courseTopics"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (error) => {
      console.error("Failed to mark content as incomplete:", error);
    },
  });
};
