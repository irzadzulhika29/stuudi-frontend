"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthLayout from "./AuthLayout";
import { usePasswordVisibility } from "@/features/auth/hooks/usePasswordVisibility";

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
          <span className="text-black">Stuudoc!</span>
        </>
      }
      googleButtonText="Masuk menggunakan google"
      bottomText="Belum punya akun?"
      bottomLinkText="Daftar disini"
      bottomLinkUrl="/register"
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
            className="text-sm text-[#27A8F3] hover:underline hover:text-[#1E8FD4]"
          >
            Lupa Password?
          </Link>
        </div>

        <Button
          variant="primary"
          className="w-full rounded-2xl py-3 !text-lg shadow-blue-300/50 shadow-lg"
        >
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}
