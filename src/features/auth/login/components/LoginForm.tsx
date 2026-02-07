"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { useLogin } from "../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { LoginSchema, LoginSchemaType } from "../schemas/loginSchema";
import { AxiosError } from "axios";
import { ApiError } from "@/shared/api/api";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const {
    isVisible: isPasswordVisible,
    toggle: togglePasswordVisibility,
    Icon: EyeIcon,
  } = usePasswordVisibility();

  const { mutate: login, isPending, isError, error } = useLogin();

  const onSubmit = (data: LoginSchemaType) => {
    login(data);
  };

  const getErrorMessage = (error: AxiosError<ApiError> | null) => {
    if (!error) return "";

    // Status Code Specific Handling
    if (error.response?.status === 401) {
      return "Username atau password salah. Silakan periksa kembali.";
    }

    if (error.response?.status === 429) {
      return "Terlalu banyak percobaan login. Silakan tunggu beberapa saat.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    }

    // Fallback to API message or Generic message
    return error.response?.data?.message || "Terjadi kesalahan sistem. Silakan coba lagi nanti.";
  };

  const currentErrorMessage = isError ? getErrorMessage(error) : "";

  return (
    <motion.form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Login form"
    >
      <AnimatePresence mode="wait">
        {currentErrorMessage && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-500 shadow-sm"
            role="alert"
          >
            <div className="flex items-start gap-3 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{currentErrorMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <Input
          id="identifier"
          type="text"
          placeholder="Username / Email"
          {...register("identifier")}
          error={errors.identifier?.message}
          className="transition-all duration-300 focus:scale-[1.01]"
          disabled={isPending}
          aria-label="Username atau Email"
        />

        <Input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          rightIcon={EyeIcon}
          onRightIconClick={togglePasswordVisibility}
          {...register("password")}
          error={errors.password?.message}
          className="transition-all duration-300 focus:scale-[1.01]"
          disabled={isPending}
          aria-label="Password"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-secondary hover:text-secondary/80 text-sm font-medium transition-colors hover:underline"
        >
          Lupa Password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="shadow-secondary/20 hover:shadow-secondary/30 w-full rounded-xl text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Memproses...
          </span>
        ) : (
          "Masuk Sekarang"
        )}
      </Button>
    </motion.form>
  );
}
