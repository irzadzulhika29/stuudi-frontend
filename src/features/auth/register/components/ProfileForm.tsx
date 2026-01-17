"use client";

import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
  isLoading?: boolean;
}

export default function ProfileForm({
  onSubmit,
  isLoading = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nama depan wajib diisi";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Nama depan minimal 2 karakter";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "Nama depan hanya boleh berisi huruf";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nama belakang wajib diisi";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Nama belakang minimal 2 karakter";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Nama belakang hanya boleh berisi huruf";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username hanya boleh berisi huruf, angka, dan underscore";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password harus mengandung huruf besar, kecil, dan angka";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="firstName"
        placeholder="Nama depan"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        disabled={isLoading}
      />

      <Input
        type="text"
        name="lastName"
        placeholder="Nama belakang"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        disabled={isLoading}
      />

      <Input
        type="text"
        name="username"
        placeholder="Buat username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        disabled={isLoading}
      />

      <Input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Buat password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        rightIcon={
          showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )
        }
        onRightIconClick={() => setShowPassword(!showPassword)}
        disabled={isLoading}
      />

      <Input
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Konfirmasi password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        rightIcon={
          showConfirmPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )
        }
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-secondary/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Lanjutkan"
        )}
      </button>
    </form>
  );
}
