import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface QuizOption {
  option_id: string;
  option_text: string;
  sequence: number;
}

export interface QuizQuestion {
  question_id: string;
  question_text: string;
  question_type: "single" | "multiple";
  points: number;
  options: QuizOption[];
}

export interface ContentBlock {
  block_id: string;
  type: "text" | "media" | "quiz";
  sequence: number;
  // Text block
  text_content?: string;
  // Media block
  media_type?: "image" | "video";
  media_url?: string;
  // Quiz block
  questions?: QuizQuestion[];
}

export interface ContentDetails {
  content_id: string;
  title: string;
  type: "materi" | "quiz";
  sequence: number;
  topic_id: string;
  topic_name: string;
  is_completed: boolean;
  blocks: ContentBlock[];
}

interface ContentDetailsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ContentDetails;
}

export function useGetContentDetails(contentId: string | null) {
  return useQuery<ContentDetailsResponse, Error>({
    queryKey: ["contentDetails", contentId],
    queryFn: async () => {
      if (!contentId) throw new Error("No content ID provided");
      const response = await api.get<ContentDetailsResponse>(
        API_ENDPOINTS.COURSES.CONTENTDETAILS(contentId)
      );
      return response.data;
    },
    enabled: !!contentId && contentId !== "new",
  });
}
