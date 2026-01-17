import React, { useRef, useState, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function OtpInput({
  length = 6,
  onComplete,
  className = "",
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);

    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.findIndex((val) => val === "");
      if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < length) newOtp[i] = digit;
    });
    setOtp(newOtp);
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onComplete(combinedOtp);

    const nextIndex = digits.length < length ? digits.length : length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => {
            inputRefs.current[index] = input;
          }}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-14 h-14 text-center text-2xl font-bold border rounded-xl focus:ring-2 focus:ring-[#27A8F3]/20 focus:outline-none transition-all text-gray-800 ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-70"
              : "border-gray-300 focus:border-[#27A8F3]"
          }`}
          maxLength={1}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
