"use client";

import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import Select from "@/shared/components/ui/Select";

interface SchoolData {
  schoolName: string;
  cityId: string;
  year: number;
}

interface SchoolInfoFormProps {
  onSubmit: (data: SchoolData) => void;
  isLoading?: boolean;
}

const schoolOptions = [
  { value: "SMA Negeri 1 Jakarta", label: "SMA Negeri 1 Jakarta" },
  { value: "SMA Negeri 2 Jakarta", label: "SMA Negeri 2 Jakarta" },
  { value: "SMA Negeri 3 Jakarta", label: "SMA Negeri 3 Jakarta" },
  { value: "SMA Negeri 8 Jakarta", label: "SMA Negeri 8 Jakarta" },
  { value: "SMA Negeri 68 Jakarta", label: "SMA Negeri 68 Jakarta" },
  { value: "SMA Negeri 70 Jakarta", label: "SMA Negeri 70 Jakarta" },
];

const provinceOptions = [
  { value: "DKI Jakarta", label: "DKI Jakarta" },
  { value: "Jawa Barat", label: "Jawa Barat" },
  { value: "Jawa Tengah", label: "Jawa Tengah" },
  { value: "Jawa Timur", label: "Jawa Timur" },
  { value: "Banten", label: "Banten" },
  { value: "Yogyakarta", label: "D.I. Yogyakarta" },
];

export default function SchoolInfoForm({
  onSubmit,
  isLoading = false,
}: SchoolInfoFormProps) {
  const [formData, setFormData] = useState({
    schoolName: "",
    province: "",
    city: "",
    year: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.schoolName)
      newErrors.schoolName = "Nama sekolah wajib dipilih";
    if (!formData.province) newErrors.province = "Provinsi wajib dipilih";
    if (!formData.city.trim()) {
      newErrors.city = "Kabupaten/Kota wajib diisi";
    } else if (formData.city.trim().length < 3) {
      newErrors.city = "Kabupaten/Kota minimal 3 karakter";
    }

    if (!formData.year) {
      newErrors.year = "Angkatan wajib diisi";
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = "Angkatan harus 4 digit tahun";
    } else {
      const yearNum = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 2000 || yearNum > currentYear + 10) {
        newErrors.year = `Angkatan harus antara 2000-${currentYear + 10}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        schoolName: formData.schoolName,
        cityId: formData.city,
        year: parseInt(formData.year),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        name="schoolName"
        value={formData.schoolName}
        onChange={handleChange}
        options={schoolOptions}
        placeholder="Nama sekolah"
        error={errors.schoolName}
        disabled={isLoading}
      />

      <Select
        name="province"
        value={formData.province}
        onChange={handleChange}
        options={provinceOptions}
        placeholder="Provinsi"
        error={errors.province}
        disabled={isLoading}
      />

      <Input
        type="text"
        name="city"
        placeholder="Kabupaten atau Kota"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        disabled={isLoading}
      />

      <Input
        type="text"
        name="year"
        placeholder="Angkatan (contoh: 2024)"
        value={formData.year}
        onChange={handleChange}
        error={errors.year}
        maxLength={4}
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
          "Selesai"
        )}
      </button>
    </form>
  );
}
