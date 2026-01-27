"use client";

import AuthLayout from "../../shared/components/AuthLayout";
import LoginForm from "../components/LoginForm";

export default function LoginContainer() {
  return (
    <AuthLayout
      title={
        <>
          Selamat datang, <span className="text-primary-light">Arterians!</span>
        </>
      }
      subtitle="Masuk untuk melanjutkan pembelajaranmu dan jangan lupa ambil kuis mu hari ini!"
    >
      <LoginForm />
    </AuthLayout>
  );
}
