"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/features/user/dashboard/courses/components/CourseCard";
import { useState } from "react";
import { JoinClassModal } from "@/shared/components/ui/JoinClassModal";
import EmptyState from "@/shared/components/ui/EmptyState";
import { CourseListSkeleton } from "../components/CourseListSkeleton";
import { useMyCourses } from "../hooks/useMyCourses";
import { useEnrollCourse } from "../hooks/useEnrollCourse";

export function CoursesContainer() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyCourses();
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();

  const handleJoinClass = (code: string) => {
    enroll(code, {
      onSuccess: () => {
        setShowJoinModal(false);
      },
    });
  };

  const courses = data?.courses || [];
  const filteredCourses = searchQuery
    ? courses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : courses;

  return (
    <>
      <div className="min-h-screen overflow-x-hidden px-4 py-6">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Courses</h1>
          <p className="text-lg text-white/80">Mau belajar apa hari ini?</p>
        </div>

        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/60"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari kelas.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-white/30 bg-white/10 py-3 pr-4 pl-12 text-white placeholder-white/60 backdrop-blur-sm transition-all focus:border-white/50 focus:bg-white/15 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-secondary-light hover:bg-secondary-default rounded-full p-3 text-white shadow-lg transition-colors"
            title="Tambah Kelas"
          >
            <Plus size={24} />
          </button>
        </div>

        {isLoading ? (
          <CourseListSkeleton count={6} />
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.course_id}
                id={course.course_id}
                title={course.name}
                thumbnail={course.image_url}
                studentCount={course.student_count}
                progress={course.progress_percentage}
                isEnrolled={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "Tidak ditemukan" : "Belum ada kelas"}
            description={
              searchQuery
                ? `Tidak ada kelas yang cocok dengan "${searchQuery}"`
                : "Yuk tambah kelas pertamamu dengan klik tombol +"
            }
            actionLabel="Tambah Kelas"
            actionIcon={<Plus size={20} />}
            onAction={() => setShowJoinModal(true)}
            imageSrc="/images/mascot/chiby.webp"
            className="text-white"
          />
        )}
      </div>

      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinClass={handleJoinClass}
        isLoading={isEnrolling}
      />
    </>
  );
}
