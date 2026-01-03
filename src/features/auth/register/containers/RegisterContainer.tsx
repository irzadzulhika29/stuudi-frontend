"use client";

import AuthLayout from "../../shared/components/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import OtpVerification from "../components/OtpVerification";
import { useRegisterForm } from "../hooks/useRegisterForm";
import FireText from "../../shared/components/FireText";

export default function RegisterContainer() {
  const { step, email, setEmail, handleRegisterSubmit, handleOtpComplete } =
    useRegisterForm();

  if (step === "otp") {
    return (
      <AuthLayout
        title="Verifikasi Email"
        subtitle="Kami telah mengirimkan kode verifikasi. Silakan periksa kotak masuk email kamu di "
      >
        <OtpVerification email={email} onComplete={handleOtpComplete} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={
        <>
          Bergabunglah bersama, <FireText text="Arterians!" />
        </>
      }
      subtitle="Daftar sekarang dan mulai perjalanan belajarmu bersama kami!"
      googleButtonText="Daftar menggunakan google"
      bottomText="Sudah punya akun?"
      bottomLinkText="Masuk disini"
      bottomLinkHref="/login"
    >
      <RegisterForm
        email={email}
        setEmail={setEmail}
        onSubmit={handleRegisterSubmit}
      />
    </AuthLayout>
  );
}
