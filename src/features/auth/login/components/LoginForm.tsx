"use client";

import Link from "next/link";
import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { useLogin } from "../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string>("");

  const {
    isVisible: isPasswordVisible,
    toggle: togglePasswordVisibility,
    Icon: EyeIcon,
  } = usePasswordVisibility();

  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (identifier.length < 3) {
      setValidationError("Username/Email harus memiliki minimal 3 karakter.");
      return;
    }

    if (password.length < 3) {
      // minimal validation
      setValidationError("Password terlalu pendek, mohon periksa kembali.");
      return;
    }

    login({ identifier, password });
  };

  const errorMessage =
    validationError ||
    error?.response?.data?.message ||
    (isError ? "Terjadi kesalahan saat login." : "");

  return (
    <motion.form
      className="space-y-4"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-500 shadow-sm"
          >
            <div className="p-4">{errorMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Username / Email"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (validationError) setValidationError("");
          }}
          required
          className="transition-all duration-300 focus:scale-[1.01]"
        />

        <Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          rightIcon={EyeIcon}
          onRightIconClick={togglePasswordVisibility}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationError) setValidationError("");
          }}
          required
          className="transition-all duration-300 focus:scale-[1.01]"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-secondary text-sm font-medium transition-colors hover:underline"
        >
          Lupa Password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="shadow-secondary/20 hover:shadow-secondary/30 w-full rounded-xl text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        disabled={isPending || !identifier || !password}
      >
        {isPending ? "Sedang Memproses..." : "Masuk Sekarang"}
      </Button>
    </motion.form>
  );
}
