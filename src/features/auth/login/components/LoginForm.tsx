"use client";

import Link from "next/link";
import Input from "@/shared/ui/Input";
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

      <button
        type="submit"
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-secondary/30"
      >
        Masuk
      </button>
    </form>
  );
}
