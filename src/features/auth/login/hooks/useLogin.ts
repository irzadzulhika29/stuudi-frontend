import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { LoginRequest, LoginResponse } from "@/features/auth/shared/types/authTypes";
import { ROUTES } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";
import { AxiosError } from "axios";
import { useToast } from "@/shared/components/ui/Toast";

export const useLogin = () => {
  const router = useRouter();
  const { showProgressToast, showToast } = useToast();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Role-based redirect: students go to /dashboard, teachers go to /dashboard-admin
      const userType = data.user_type?.toLowerCase();
      const roleName = data.roleName?.toLowerCase();

      const isStudent =
        userType === "student" ||
        userType === "siswa" ||
        roleName === "student" ||
        roleName === "siswa";

      const redirectPath = isStudent ? ROUTES.DASHBOARD : ROUTES.ADMIN_DASHBOARD;

      // Show progress toast then redirect
      showProgressToast("Login berhasil! Mengarahkan ke dashboard...", 1500, () => {
        router.push(redirectPath);
      });
    },
    onError: (error) => {
      console.error("Login failed", error);
      showToast("Login gagal. Silakan coba lagi.", "error");
    },
  });
};
