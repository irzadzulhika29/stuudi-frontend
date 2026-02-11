"use client";

import { ChevronLeft, Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { CourseInput } from "@/features/admin/dashboard/courses/components/CourseInput";
import { CourseTextArea } from "@/features/admin/dashboard/courses/components/CourseTextArea";
import { CourseFileUpload } from "@/features/admin/dashboard/courses/components/CourseFileUpload";
import { useToast } from "@/shared/components/ui/Toast";
import { useAddCourse } from "../hooks/useAddCourse";

export function CreateCourseContainer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addCourse, isPending } = useAddCourse();
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("File harus berupa gambar", "error");
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        showToast("Ukuran file maksimal 1MB", "error");
        return;
      }

      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Nama course harus diisi", "error");
      return;
    }

    if (!formData.description.trim()) {
      showToast("Deskripsi course harus diisi", "error");
      return;
    }

    if (!thumbnailFile) {
      showToast("Thumbnail course harus diupload", "error");
      return;
    }

    addCourse(
      {
        name: formData.title,
        description: formData.description,
        photo: thumbnailFile,
      },
      {
        onSuccess: () => {
          showToast("Course berhasil ditambahkan!", "success");
        },
        onError: (error) => {
          const message = error.response?.data?.message || "Gagal menambahkan course";
          showToast(message, "error");
        },
      }
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard-admin/courses"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-lg text-white">Course/Course Details</span>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-white">Tambah Kelas</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <CourseInput
            label="Nama Courses"
            placeholder="Course 1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <CourseTextArea
            label="Deskripsi Courses"
            placeholder="Lorem ipsum dolor sit amet..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="space-y-2">
            <CourseFileUpload
              ref={fileInputRef}
              label="Thumbnail Course"
              onChange={handleFileChange}
              accept="image/*"
            />

            {thumbnailPreview && (
              <div className="relative mt-4 w-full max-w-md">
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/20">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                <p className="mt-2 text-sm text-white/60">{thumbnailFile?.name}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isPending}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white bg-[#D77211] px-6 py-3 font-medium text-white transition-all hover:bg-[#C06010] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Tambah kelas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
