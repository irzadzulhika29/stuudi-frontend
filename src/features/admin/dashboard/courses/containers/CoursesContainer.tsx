"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/features/admin/dashboard/courses/components/CourseCard";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { courses } from "@/features/user/dashboard/courses/data/dummyData";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared";

export function CoursesContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollCode, setEnrollCode] = useState("");
  const router = useRouter();

  const handleEnroll = () => {
    if (enrollCode.trim()) {
      // TODO: Implement enroll logic with API
      console.log("Enrolling with code:", enrollCode);
      setEnrollCode("");
      setIsModalOpen(false);
    }
  };

  const handleCreateCourse = () => {
    setIsModalOpen(false);
    router.push("/dashboard-admin/courses/create");
  };

  return (
    <div className="min-h-screen py-6 px-4 overflow-x-hidden">
      <DashboardHeader
        title="Course"
        highlightedText="Management"
        className="mb-8"
      />

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari kelas.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary-light hover:bg-secondary-default text-white p-3 rounded-full transition-colors shadow-lg flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Course"
        size="sm"
      >
        <div className="space-y-6">
          {/* Enroll dengan kode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Masukkan Kode Enroll
            </label>
            <input
              type="text"
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value)}
              placeholder="Contoh: ABC123"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-transparent transition-all"
            />
            <button
              onClick={handleEnroll}
              disabled={!enrollCode.trim()}
              className="w-full bg-secondary-light hover:bg-secondary-default disabled:bg-neutral-200 disabled:cursor-not-allowed text-white disabled:text-neutral-400 font-medium py-3 rounded-xl transition-colors"
            >
              Enroll
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-neutral-500">atau</span>
            </div>
          </div>

          {/* Buat course baru */}
          <Button
            onClick={handleCreateCourse}
            variant="outline"
            className="!bg-secondary !rounded-xl w-full hover:!border-none hover:!text-white hover:!bg-secondary-light"
          >
            Buat Course Baru
          </Button>
        </div>
      </Modal>
    </div>
  );
}
