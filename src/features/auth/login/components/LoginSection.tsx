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
            className="text-secondary hover:text-secondary-dark text-sm hover:underline"
          >
            Lupa Password?
          </Link>
        </div>

        <Button
          variant="secondary"
          className="shadow-secondary/30 w-full rounded-2xl py-3 text-lg! shadow-lg"
        >
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}
