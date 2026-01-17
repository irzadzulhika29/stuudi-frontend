"use client";

import OtpInput from "@/shared/components/ui/OtpInput";
import { maskEmail } from "../data/stringUtils";

interface OtpVerificationProps {
  email: string;
  onComplete: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
}

export default function OtpVerification({
  email,
  onComplete,
  onResend,
  isLoading = false,
}: OtpVerificationProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div>
        <p className="text-secondary font-medium text-lg">{maskEmail(email)}</p>
      </div>

      <OtpInput onComplete={onComplete} className="my-4" disabled={isLoading} />

      {isLoading && (
        <p className="text-sm text-neutral-500">Memverifikasi...</p>
      )}

      <button
        type="button"
        onClick={onResend}
        disabled={isLoading}
        className="text-neutral-gray hover:text-secondary transition-colors text-sm disabled:opacity-50"
      >
        Kirim ulang kode
      </button>
    </div>
  );
}
