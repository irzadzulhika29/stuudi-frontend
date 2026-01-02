"use client";

import OtpInput from "@/shared/ui/OtpInput";
import { maskEmail } from "../data/stringUtils";

interface OtpVerificationProps {
  email: string;
  onComplete: (otp: string) => void;
}

export default function OtpVerification({
  email,
  onComplete,
}: OtpVerificationProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div>
        <p className="text-secondary font-medium text-lg">{maskEmail(email)}</p>
      </div>

      <OtpInput onComplete={onComplete} className="my-4" />

      <button
        type="button"
        className="text-neutral-gray hover:text-secondary transition-colors text-sm"
      >
        Kirim ulang kode
      </button>
    </div>
  );
}
