"use client";

import Link from "next/link";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import AuthLayout from "@/features/auth/shared/components/AuthLayout";
import { usePasswordVisibility } from "@/features/auth/shared/hooks/usePasswordVisibility";

export default function LoginSection() {
  const {
    isVisible: isPasswordVisible,
    toggle: togglePasswordVisibility,
    Icon: EyeIcon,
  } = usePasswordVisibility();

  return (
    <AuthLayout
      title={
        <>
          Selamat datang kembali, <br />
          <span className="text-black">Arterians!</span>
        </>
      }
    >
      <form className="space-y-5">
        <Input type="email" placeholder="Masukkan Email" />

        <Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          rightIcon={EyeIcon}
          onRightIconClick={togglePasswordVisibility}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-[#27A8F3] hover:text-[#1E8FD4] hover:underline"
          >
            Lupa Password?
          </Link>
        </div>

        <Button
          variant="primary"
          className="w-full rounded-2xl py-3 !text-lg shadow-lg shadow-blue-300/50"
        >
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}
