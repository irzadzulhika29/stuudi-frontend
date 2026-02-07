"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, MoreHorizontal, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/admin/dashboard/courses/components/TopicCard";
import { ExamCard } from "@/features/admin/dashboard/courses/components/ExamCard";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import { useTeachingCourseDetails } from "../hooks/useTeachingCourseDetails";
import { useGetCourseExams } from "../hooks/useGetCourseExams";
import { Button } from "@/shared/components/ui";
import { CourseDetailSkeleton } from "@/features/user/courses/components/CourseDetailSkeleton";
import { courseService } from "@/features/user/courses/services/courseService";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { useToast } from "@/shared/components/ui/Toast";

interface CourseDetailContainerProps {
  courseId: string;
}

export function CourseDetailContainer({ courseId }: CourseDetailContainerProps) {
  const { setCourseNav } = useCourseNavigation();
  const { data: course, isLoading, isError } = useTeachingCourseDetails(courseId);
  const { data: exams, isLoading: examsLoading } = useGetCourseExams(courseId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmUnenroll, setShowConfirmUnenroll] = useState(false);

  useEffect(() => {
    if (course) {
      setCourseNav({ id: courseId, name: course.name }, "/dashboard-admin/courses");
    }
  }, [courseId, setCourseNav, course]);

  const unenrollMutation = useMutation({
    mutationFn: () => courseService.unenrollCourse(courseId),
    onSuccess: () => {
      showToast("Berhasil keluar dari kursus", "success");
      queryClient.invalidateQueries({ queryKey: ["teachingCourses"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourseDetails", courseId] });
      setShowConfirmUnenroll(false);
      router.push("/dashboard-admin/courses");
    },
    onError: () => {
      showToast("Gagal keluar dari kursus", "error");
      setShowConfirmUnenroll(false);
    },
  });

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Gagal memuat kursus</h2>
          <Link href="/dashboard-admin/courses">
            <Button className="mt-4" variant="secondary">
              Kembali ke Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    progress: {
      current: course.progress?.current_exp || 0,
      total: course.progress?.total_exp || 100,
    },
    teachers: course.teachers?.map((t) => ({ name: t.name })) || [],
    participants: course.participants?.map((p) => ({ id: p.user_id, name: p.name })) || [],
    totalParticipants: course.total_participants || 0,
    lastAccessed: course.last_accessed || undefined,
    enrollCode: course.enrollment_code,
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <Link
              href="/dashboard-admin/courses"
              className="inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">Courses / {course.name}</span>
            </Link>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <MoreHorizontal size={18} />
              </button>

              {/* Menu Dropdown */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-white/10 bg-neutral-900/95 p-1 shadow-xl backdrop-blur-md">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowConfirmUnenroll(true);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut size={14} />
                      Unenroll
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {course.image_url && (
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
              <Image src={course.image_url} alt={course.name} fill className="object-cover" />
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{course.name}</h1>
            <Link href={`/dashboard-admin/courses/${courseId}/manage/${courseId}`}>
              <Button
                className="!text-primary hover:!bg-neutral-light !border-none !bg-white hover:!border-none"
                size="md"
                variant="outline"
              >
                Manage Course
              </Button>
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {course.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...sidebarProps} />
          </div>

          {/* Topics Section */}
          <div className="space-y-3">
            <h2 className="mb-4 text-xl font-semibold text-white">Materi</h2>
            {course.topics && course.topics.length > 0 ? (
              course.topics.map((topic, index) => (
                <TopicCard
                  key={topic.topic_id}
                  id={topic.topic_id}
                  courseId={courseId}
                  title={topic.title}
                  description={topic.description}
                  materials={
                    topic.contents?.map((c) => ({
                      id: c.content_id,
                      title: c.title,
                      isCompleted: c.is_completed,
                    })) || []
                  }
                  status={topic.status}
                  isExpanded={index === 0}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/50 backdrop-blur-sm">
                Belum ada materi yang tersedia untuk kursus ini.
              </div>
            )}
          </div>

          {/* Exams Section */}
          <div className="mt-8 space-y-3">
            <h2 className="mb-4 text-xl font-semibold text-white">Exam</h2>
            {examsLoading ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/50 backdrop-blur-sm">
                Memuat exam...
              </div>
            ) : exams && exams.length > 0 ? (
              exams.map((exam) => (
                <ExamCard
                  key={exam.exam_id}
                  examId={exam.exam_id}
                  courseId={courseId}
                  title={exam.exam_name}
                  description={exam.description}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/50 backdrop-blur-sm">
                Belum ada exam yang tersedia untuk kursus ini.
              </div>
            )}
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...sidebarProps} />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmUnenroll}
        onClose={() => setShowConfirmUnenroll(false)}
        onConfirm={() => unenrollMutation.mutate()}
        title="Keluar dari Kursus"
        message="Apakah Anda yakin ingin keluar dari kursus ini? Anda tidak akan terdaftar lagi di kursus ini."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        isLoading={unenrollMutation.isPending}
      />
    </div>
  );
}
