"use client";

import AuthLayout from "../../shared/components/AuthLayout";
import LoginForm from "../components/LoginForm";
import FireText from "../../shared/components/FireText";

export default function LoginContainer() {
  return (
    <AuthLayout
      title={
        <>
          Selamat datang, <FireText text="Arterians!" />
        </>
      }
      googleButtonText="Masuk menggunakan google"
      bottomText="Belum punya akun?"
      bottomLinkText="Daftar disini"
      bottomLinkHref="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
