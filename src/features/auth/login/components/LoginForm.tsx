"use client";

import Link from "next/link";
import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const {
    isVisible: isPasswordVisible,
    toggle: togglePasswordVisibility,
    Icon: EyeIcon,
  } = usePasswordVisibility();

  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ identifier, password });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error?.response?.data?.message || "Terjadi kesalahan saat login"}
        </div>
      )}

      <Input
        type="text"
        placeholder="Username / Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <Input
        type={isPasswordVisible ? "text" : "password"}
        placeholder="Password"
        rightIcon={EyeIcon}
        onRightIconClick={togglePasswordVisibility}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-secondary text-sm hover:underline">
          Lupa Password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        disabled={isPending || !identifier}
      >
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
