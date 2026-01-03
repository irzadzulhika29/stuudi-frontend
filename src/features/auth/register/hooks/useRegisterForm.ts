import { useState } from "react";

export const useRegisterForm = () => {
  const [step, setStep] = useState<"register" | "otp">("register");
  const [email, setEmail] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("otp");
    } else {
      if (!email) setEmail("budi@gmail.com");
      setStep("otp");
    }
  };

  const handleOtpComplete = (otp: string) => {
    console.log("OTP Completed:", otp);
  };

  return {
    step,
    email,
    setEmail,
    handleRegisterSubmit,
    handleOtpComplete,
  };
};
