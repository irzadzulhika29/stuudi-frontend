"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/authService";
import { useToast } from "@/shared/components/ui/Toast";

type RegisterStep = "register" | "otp" | "profile" | "school";

interface ProfileData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface SchoolData {
  schoolName: string;
  cityId: string;
  year: number;
}

export const useRegisterForm = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<RegisterStep>("register");
  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => authService.sendOtp({ email }),
    onSuccess: (data) => {
      setSessionToken(data.session_token);
      setStep("otp");
      showToast("Kode OTP telah dikirim ke email kamu", "success");
    },
    onError: (error: Error) => {
      showToast(error.message || "Gagal mengirim OTP", "error");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otp: string) => authService.verifyOtp(sessionToken, { otp }),
    onSuccess: (data) => {
      setSessionToken(data.session_token);
      setStep("profile");
      showToast("Email berhasil diverifikasi", "success");
    },
    onError: (error: Error) => {
      showToast(error.message || "Kode OTP tidak valid", "error");
    },
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: (data: {
      first_name: string;
      last_name: string;
      password: string;
      confirm_password: string;
      school_name: string;
      city_id: string;
      year: number;
    }) => authService.completeRegistration(sessionToken, data),
    onSuccess: () => {
      showToast("Pendaftaran berhasil! Mengarahkan ke dashboard...", "success");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      showToast(error.message || "Gagal menyelesaikan pendaftaran", "error");
    },
  });

  const getStepNumber = (): number => {
    const stepMap = { register: 1, otp: 2, profile: 3, school: 4 };
    return stepMap[step];
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      sendOtpMutation.mutate(email);
    }
  };

  const handleOtpComplete = (otp: string) => {
    verifyOtpMutation.mutate(otp);
  };

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setStep("school");
  };

  const handleSchoolSubmit = (data: SchoolData) => {
    completeRegistrationMutation.mutate({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      password: profileData.password,
      confirm_password: profileData.confirmPassword,
      school_name: data.schoolName,
      city_id: data.cityId,
      year: data.year,
    });
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate(email);
  };

  return {
    step,
    email,
    setEmail,
    profileData,
    sessionToken,
    isLoading: sendOtpMutation.isPending || verifyOtpMutation.isPending || completeRegistrationMutation.isPending,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isCompletingRegistration: completeRegistrationMutation.isPending,
    currentStepNumber: getStepNumber(),
    handleRegisterSubmit,
    handleOtpComplete,
    handleProfileSubmit,
    handleSchoolSubmit,
    handleResendOtp,
  };
};
