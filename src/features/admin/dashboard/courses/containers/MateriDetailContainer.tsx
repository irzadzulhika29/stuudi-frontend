"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { MateriDetailSkeleton } from "@/features/user/courses/components/MateriDetailSkeleton";
import Button from "@/shared/components/ui/Button";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import { useGetContentDetails } from "../hooks/useGetContentDetails";
import { useTeachingCourseDetails } from "../hooks/useTeachingCourseDetails";

interface MateriDetailContainerProps {
  courseId: string;
  topicId: string;
  materiId: string;
}

export function MateriDetailContainer({ courseId, topicId, materiId }: MateriDetailContainerProps) {
  const { setMateriNav } = useCourseNavigation();

  const {
    data: contentResponse,
    isLoading: isLoadingContent,
    isError: isContentError,
  } = useGetContentDetails(materiId);
  const { data: courseDetails, isLoading: isLoadingCourse } = useTeachingCourseDetails(courseId);

  const content = contentResponse?.data;

  useEffect(() => {
    if (content) {
      console.log("DEBUG: Admin Content Details:", content);
    }
  }, [content]);

  useEffect(() => {
    if (content && courseDetails) {
      setMateriNav(
        { id: courseId, name: courseDetails.name },
        { id: topicId, name: content.title },
        { id: materiId, name: content.title }
      );
    }
  }, [courseId, topicId, materiId, setMateriNav, content, courseDetails]);

  const isLoading = isLoadingContent || isLoadingCourse;

  if (isLoading) {
    return <MateriDetailSkeleton />;
  }

  if (isContentError || !content) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Materi tidak ditemukan</h2>
          <Link href={`/dashboard-admin/courses/${courseId}/topic/${topicId}`}>
            <Button className="mt-4" variant="secondary">
              Kembali ke Topik
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    progress: {
      current: courseDetails?.progress?.current_exp || 0,
      total: courseDetails?.progress?.total_exp || 100,
    },
    teachers: courseDetails?.teachers?.map((t) => ({ name: t.name })) || [],
    participants: courseDetails?.participants?.map((p) => ({ id: p.user_id, name: p.name })) || [],
    totalParticipants: courseDetails?.total_participants || 0,
    lastAccessed: courseDetails?.last_accessed || undefined,
    enrollCode: courseDetails?.enrollment_code,
  };

  const renderBlock = (block: (typeof content.blocks)[0], index: number) => {
    switch (block.type) {
      case "text":
        return (
          <div key={block.block_id} className="mb-6">
            <div
              className="prose prose-invert max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: block.text_content || "" }}
            />
          </div>
        );
      case "media":
        if (!block.media_url) return null;
        return (
          <div key={block.block_id} className="mb-6">
            {block.media_type === "image" && (
              <div className="overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.media_url} alt="Media content" className="h-auto w-full" />
              </div>
            )}
            {block.media_type === "video" && (
              <div className="overflow-hidden rounded-lg">
                <video src={block.media_url} controls className="w-full">
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        );
      case "quiz":
        if (!block.questions || block.questions.length === 0) return null;
        return (
          <div key={block.block_id}>
            {block.questions.map((question, qIndex) => (
              <div
                key={question.question_id}
                className="mb-6 rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm md:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Pertanyaan {index + qIndex + 1}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-red-500">
                    {question.points} Poin
                  </span>
                </div>
                <p className="mb-4 font-medium text-white">{question.question_text}</p>
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={option.option_id}
                      className={`flex items-center gap-3 rounded-xl border p-4 ${
                        option.is_correct
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <span className="flex-1 text-sm text-white">
                        {String.fromCharCode(65 + optIndex)}. {option.option_text}
                      </span>
                      {option.is_correct && (
                        <span className="text-xs text-emerald-400">✓ Jawaban Benar</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/dashboard-admin/courses/${courseId}/topic/${topicId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / {courseDetails?.name} / {content.title}
            </span>
          </Link>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...sidebarProps} />
          </div>

          <div className="flex items-start justify-between gap-4 p-5">
            <h1 className="text-xl font-bold text-white md:text-2xl">{content.title}</h1>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
              {content.type}
            </span>
          </div>

          <div className="p-5 md:p-6">
            {content.blocks && content.blocks.length > 0 ? (
              content.blocks.map((block, index) => renderBlock(block, index))
            ) : (
              <div className="py-8 text-center text-white/50">
                Belum ada konten pada materi ini.
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-4">
            <Button
              href={`/dashboard-admin/courses/${courseId}/topic/${topicId}`}
              variant="secondary"
              className="w-full"
            >
              Kembali ke Topik
            </Button>
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...sidebarProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
