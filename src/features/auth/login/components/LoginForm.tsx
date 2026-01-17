"use client";

import Link from "next/link";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";

export default function LoginForm() {
  const {
    isVisible: isPasswordVisible,
    toggle: togglePasswordVisibility,
    Icon: EyeIcon,
  } = usePasswordVisibility();

  return (
    <form className="space-y-4">
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
          className="text-sm text-secondary hover:underline"
        >
          Lupa Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full !rounded-full py-3 shadow-lg shadow-secondary/30"
      >
        Masuk
      </Button>
    </form>
  );
}
