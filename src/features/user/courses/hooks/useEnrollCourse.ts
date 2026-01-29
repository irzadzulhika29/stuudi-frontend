import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/courseService";
import { useToast } from "@/shared/components/ui/Toast";
import { AxiosError } from "axios";
import { ApiError } from "@/shared/api/api";
import { useRouter } from "next/navigation";

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (code: string) => courseService.enrollCourse(code),
    onSuccess: (data) => {
      showToast("Berhasil mendaftar ke kelas!", "success");
      queryClient.invalidateQueries({ queryKey: ["browse-courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      router.push(`/courses/${data.course_id}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Gagal mendaftar ke kelas";
      showToast(message, "error");
    },
  });
};
