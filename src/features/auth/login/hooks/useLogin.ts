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
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });
};
