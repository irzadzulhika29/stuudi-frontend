"use client";

import Input from "@/shared/ui/Input";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({
  email,
  setEmail,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input
        type="email"
        placeholder="Masukkan Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-secondary/30"
      >
        Daftar
      </button>
    </form>
  );
}
