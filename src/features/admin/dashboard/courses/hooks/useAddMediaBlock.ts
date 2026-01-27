import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

interface AddMediaBlockResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    block_id: string;
    type: "media";
    sequence: number;
    media_type: string;
    media_url: string;
  };
}

export const useAddMediaBlock = (contentId: string) => {
  return useMutation<AddMediaBlockResponse, AxiosError<ApiError>, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await api.post<AddMediaBlockResponse>(
        API_ENDPOINTS.TEACHER.ADD_MEDIA_BLOCK(contentId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};
