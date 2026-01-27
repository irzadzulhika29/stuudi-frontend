import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

interface AddTextBlockRequest {
  text_content: string;
}

interface AddTextBlockResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    block_id: string;
    type: "text";
    sequence: number;
    text_content: string;
  };
}

export const useAddTextBlock = (contentId: string) => {
  return useMutation<AddTextBlockResponse, AxiosError<ApiError>, AddTextBlockRequest>({
    mutationFn: async (data: AddTextBlockRequest) => {
      const response = await api.post<AddTextBlockResponse>(
        API_ENDPOINTS.TEACHER.ADD_TEXT_BLOCK(contentId),
        data
      );
      return response.data;
    },
  });
};
