"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/features/admin/dashboard/courses/components/CourseCard";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTeachingCourses } from "@/features/admin/dashboard/courses/hooks/useTeachingCourses";
import { JoinClassModal } from "@/shared/components/ui/JoinClassModal";

export function CoursesContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError } = useTeachingCourses();

  console.log("Teaching Courses Data:", data);
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);

  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];
    if (!searchQuery.trim()) return data.courses;

    return data.courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.courses, searchQuery]);

  const handleJoinClass = (code: string) => {
    console.log("Admin joining class with code:", code);
    setShowJoinModal(false);
  };

  const handleAddClass = () => {
    setShowJoinModal(false);
    router.push("/dashboard-admin/courses/create");
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden px-4 py-6">
        <DashboardHeader title="Course" highlightedText="Management" className="mb-8" />

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
            className="bg-secondary-light hover:bg-secondary-default flex items-center justify-center rounded-full p-3 text-white shadow-lg transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-500/20 p-4 text-center text-white">
            Gagal memuat data courses. Silakan coba lagi.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  id={course.course_id}
                  title={course.name}
                  thumbnail={course.image_url}
                  studentCount={course.student_count}
                  progress={0}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-white/60">
                {searchQuery ? "Tidak ada kelas yang ditemukan." : "Belum ada kelas."}
              </div>
            )}
          </div>
        )}
      </div>

      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        showAddClass={true}
        onJoinClass={handleJoinClass}
        onAddClass={handleAddClass}
      />
    </>
  );
}
