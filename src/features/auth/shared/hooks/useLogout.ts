import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { ROUTES } from "@/shared/config";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });
};
