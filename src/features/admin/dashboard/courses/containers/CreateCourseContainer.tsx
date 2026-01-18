"use client";

import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CourseInput } from "@/features/admin/dashboard/courses/components/CourseInput";
import { CourseTextArea } from "@/features/admin/dashboard/courses/components/CourseTextArea";
import { CourseFileUpload } from "@/features/admin/dashboard/courses/components/CourseFileUpload";

export function CreateCourseContainer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Implement actual save logic
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard-admin/courses"
            className="w-10 h-10 bg-[#FF9D00] rounded-full flex items-center justify-center text-white hover:bg-[#E68E00] transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-white text-lg">Course/Course Details</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Tambah Kelas</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <CourseInput
            label="Nama Courses"
            placeholder="Course 1"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <CourseTextArea
            label="Deskripsi Courses"
            placeholder="Lorem ipsum dolor sit amet..."
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <CourseFileUpload
            label="Thumbnail Course"
            onChange={(e) => console.log(e.target.files)}
          />

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#D77211] text-white rounded-full font-medium border border-white hover:bg-[#C06010] transition-all"
            >
              <Plus size={20} />
              <span>Tambah kelas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
