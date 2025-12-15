"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthLayout from "./AuthLayout";
import OtpInput from "@/components/ui/OtpInput";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { maskEmail } from "@/features/auth/utils/stringUtils";


export default function RegisterSection() {
  const { step, email, setEmail, handleRegisterSubmit, handleOtpComplete } =
    useRegisterForm();
;

  if (step === "otp") {
    return (
      <AuthLayout
        title="" 
      >
        <div className="flex flex-col items-center text-center space-y-8 mt-8">
          <div className="space-y-4">
            <p className="text-gray-600 text-lg leading-relaxed">
              Kami telah mengirimkan kode verifikasi. Silakan periksa <br />
              kotak masuk email kamu di
            </p>
            <p className="text-red-500 font-medium text-lg">
              {maskEmail(email)}
            </p>
          </div>

          <OtpInput onComplete={handleOtpComplete} className="my-8" />

          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            kirim ulang kode
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={
        <>
          Bergabunglah bersama kami, <br />
          <span className="text-black">Calon Stuudoc!</span>
        </>
      }
      googleButtonText="Daftar menggunakan google"
      bottomText="Sudah punya akun?"
      bottomLinkText="Masuk disini"
      bottomLinkUrl="/login"
    >
      <form className="space-y-4" onSubmit={handleRegisterSubmit}>
        <Input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          variant="primary"
          className="w-full rounded-2xl py-3 !text-lg shadow-blue-300/50 shadow-lg mt-4"
        >
          Selesai
        </Button>
      </form>
    </AuthLayout>
  );
}
