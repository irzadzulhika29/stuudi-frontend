"use client";

import AuthLayout from "../../shared/components/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import OtpVerification from "../components/OtpVerification";
import ProfileForm from "../components/ProfileForm";
import SchoolInfoForm from "../components/SchoolInfoForm";
import { useRegisterForm } from "../hooks/useRegisterForm";
export default function RegisterContainer() {
  const {
    step,
    email,
    setEmail,
    currentStepNumber,
    handleRegisterSubmit,
    handleOtpComplete,
    handleProfileSubmit,
    handleSchoolSubmit,
    handleResendOtp,
    isSendingOtp,
    isVerifyingOtp,
    isCompletingRegistration,
  } = useRegisterForm();

  if (step === "register") {
    return (
      <AuthLayout
        title={
          <>
            Bergabunglah bersama,{" "}
            <span className="text-primary-light">Arterians!</span>
          </>
        }
        subtitle="Daftar sekarang dan mulai perjalanan belajarmu bersama kami!"
        googleButtonText="Daftar menggunakan google"
        bottomText="Sudah punya akun?"
        bottomLinkText="Masuk disini"
        bottomLinkHref="/login"
        currentStep={currentStepNumber}
        isLinkDisabled={isSendingOtp}
      >
        <RegisterForm
          email={email}
          setEmail={setEmail}
          onSubmit={handleRegisterSubmit}
          isLoading={isSendingOtp}
        />
      </AuthLayout>
    );
  }

  if (step === "otp") {
    return (
      <AuthLayout
        title={
          <>
            Selamat datang,{" "}
            <span className="text-primary-light">Arterians!</span>
          </>
        }
        subtitle="Kami telah mengirimkan kode verifikasi. Silakan periksa kotak masuk email kamu di"
        currentStep={currentStepNumber}
        isLinkDisabled={isVerifyingOtp}
      >
        <OtpVerification
          email={email}
          onComplete={handleOtpComplete}
          onResend={handleResendOtp}
          isLoading={isVerifyingOtp}
        />
      </AuthLayout>
    );
  }

  if (step === "profile") {
    return (
      <AuthLayout
        title={
          <>
            Selamat datang,{" "}
            <span className="text-primary-light">Arterians!</span>
          </>
        }
        subtitle="Sebelum memulai, yuk lengkapi data diri kamu!"
        currentStep={currentStepNumber}
      >
        <ProfileForm onSubmit={handleProfileSubmit} />
      </AuthLayout>
    );
  }

  if (step === "school") {
    return (
      <AuthLayout
        title={
          <>
            Selamat datang,{" "}
            <span className="text-primary-light">Arterians!</span>
          </>
        }
        subtitle="Hai [nama depan], Supaya kami bisa bantu kamu jadi juara, kamu dari sekolah mana?"
        currentStep={currentStepNumber}
        isLinkDisabled={isCompletingRegistration}
      >
        <SchoolInfoForm
          onSubmit={handleSchoolSubmit}
          isLoading={isCompletingRegistration}
        />
      </AuthLayout>
    );
  }

  return null;
}
