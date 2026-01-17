"use client";

import { useState } from "react";
import Input from "@/shared/components/ui/Input";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function RegisterForm({
  email,
  setEmail,
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email wajib diisi");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    onSubmit(e);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Masukkan Email"
        value={email}
        onChange={handleEmailChange}
        error={error}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-secondary/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Daftar"
        )}
      </button>
    </form>
  );
}
