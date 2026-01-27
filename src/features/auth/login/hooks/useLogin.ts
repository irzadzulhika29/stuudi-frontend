import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { LoginRequest, LoginResponse } from "@/features/auth/shared/types/authTypes";
import { ROUTES } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";
import { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      console.log("Login successful", data);
      console.log("User type from API:", data.user_type);

      // Role-based redirect: students go to /dashboard, teachers go to /dashboard-admin
      const userType = data.user_type?.toLowerCase();
      const isStudent = userType === "student" || userType === "siswa";
      const redirectPath = isStudent ? ROUTES.DASHBOARD : ROUTES.ADMIN_DASHBOARD;

      console.log("Is student:", isStudent, "| Redirecting to:", redirectPath);
      router.push(redirectPath);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });
};
