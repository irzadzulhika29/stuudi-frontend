"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/shared/components/courses";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeachingCourses } from "@/features/admin/dashboard/courses/hooks/useTeachingCourses";
import { useEnrollCourse } from "@/features/user/courses/hooks/useEnrollCourse";
import { JoinClassModal } from "@/shared/components/ui/JoinClassModal";
import { CourseListSkeleton } from "@/features/user/courses/components/CourseListSkeleton";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";

export function CoursesContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();
  const { clearNav } = useCourseNavigation();

  const {
    data: teachingData,
    isLoading: isTeachingLoading,
    isError: isTeachingError,
  } = useTeachingCourses();
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();

  // Clear sidebar navigation when visiting courses list
  useEffect(() => {
    clearNav();
  }, [clearNav]);

  const filteredCourses = useMemo(() => {
    const courses = teachingData?.courses ?? [];
    if (!searchQuery.trim()) return courses;

    return courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachingData, searchQuery]);

  const handleJoinClass = (code: string) => {
    enroll(code, {
      onSuccess: () => {
        setShowJoinModal(false);
      },
    });
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

        {/* Teaching Courses Section */}
        <h2 className="mb-4 text-xl font-bold text-white">Kelas Mengajar</h2>

        {isTeachingLoading && <CourseListSkeleton count={3} />}

        {isTeachingError && (
          <div className="mb-8 rounded-xl bg-red-500/20 p-4 text-center text-white">
            Gagal memuat data courses. Silakan coba lagi.
          </div>
        )}

        {!isTeachingLoading && !isTeachingError && (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  id={course.course_id}
                  title={course.name}
                  thumbnail={course.image_url}
                  description={course.description}
                  studentCount={course.student_count}
                  progress={0}
                  basePath="/dashboard-admin/courses"
                  showUnenrollMenu={true}
                  isEnrolled={true}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-white/60">
                {searchQuery
                  ? "Tidak ada kelas mengajar yang ditemukan."
                  : "Belum ada kelas mengajar."}
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
        isLoading={isEnrolling}
      />
    </>
  );
}
