"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/shared/components/ui/Button";
import { QuizBlockQuestion } from "../components/QuizBlockQuestion";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/courses/components/CourseInfoSidebar";
import { useContentDetails } from "../hooks/useContentDetails";
import { useCourseDetails } from "../hooks/useCourseDetails";
import { useMarkContentComplete, useMarkContentIncomplete } from "../hooks/useContentCompletion";
import { ContentBlock } from "../types/courseTypes";
import { CompletionButton } from "../components/CompletionButton";
import { QuizContainer } from "../components/quiz/QuizContainer";
import { QuizData } from "../types/cTypes";

interface MateriDetailContainerProps {
  courseId: string;
  topicId: string;
  materiId: string;
}

export function MateriDetailContainer({ courseId, topicId, materiId }: MateriDetailContainerProps) {
  const { setMateriNav } = useCourseNavigation();

  const {
    data: content,
    isLoading: isLoadingContent,
    isError: isContentError,
  } = useContentDetails(materiId);
  const { data: courseDetails, isLoading: isLoadingCourse } = useCourseDetails(courseId);
  const markComplete = useMarkContentComplete();
  const markIncomplete = useMarkContentIncomplete();

  useEffect(() => {
    if (content) {
      console.log("DEBUG: Content Details:", content);
    }
  }, [content]);

  useEffect(() => {
    if (content && courseDetails) {
      setMateriNav(
        { id: courseId, name: courseDetails.name },
        { id: topicId, name: content.topicName },
        { id: materiId, name: content.title }
      );
    }
  }, [courseId, topicId, materiId, setMateriNav, content, courseDetails]);

  const isLoading = isLoadingContent || isLoadingCourse;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p>Memuat materi...</p>
        </div>
      </div>
    );
  }

  if (isContentError || !content) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Materi tidak ditemukan</h2>
          <Link href={`/courses/${courseId}/topic/${topicId}`}>
            <Button className="mt-4" variant="secondary">
              Kembali ke Topik
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (content.type === "quiz") {
    const quizData: QuizData = {
      id: content.contentId,
      title: content.title,
      description: "",
      questions: [],
      lastAttemptId: content.lastAttemptId,
    };

    return (
      <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
        <div className="mb-4">
          <Link
            href={`/courses/${courseId}/topic/${topicId}`}
            className="inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / {courseDetails?.name} / {content.topicName} / {content.title}
            </span>
          </Link>
        </div>
        <QuizContainer quiz={quizData} courseId={courseId} topicId={topicId} />
      </div>
    );
  }

  const sidebarProps = {
    progress: courseDetails
      ? {
          current: courseDetails.progress.current_exp,
          total: courseDetails.progress.total_exp > 0 ? courseDetails.progress.total_exp : 100,
        }
      : { current: 0, total: 100 },
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "text":
        return (
          <div key={block.blockId} className="mb-6">
            <div
              className="prose prose-invert max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: block.textContent || "" }}
            />
          </div>
        );
      case "media":
        if (!block.mediaUrl) return null;
        return (
          <div key={block.blockId} className="mb-6">
            {block.mediaType === "image" && (
              <div className="overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.mediaUrl}
                  alt={block.caption || "Media content"}
                  className="h-auto w-full"
                />
                {block.caption && (
                  <p className="mt-2 text-center text-sm text-white/60">{block.caption}</p>
                )}
              </div>
            )}
            {block.mediaType === "video" && (
              <div className="overflow-hidden rounded-lg">
                <video src={block.mediaUrl} controls className="w-full">
                  Your browser does not support the video tag.
                </video>
                {block.caption && (
                  <p className="mt-2 text-center text-sm text-white/60">{block.caption}</p>
                )}
              </div>
            )}
          </div>
        );
      case "quiz":
        if (!block.questions || block.questions.length === 0) return null;
        return (
          <div key={block.blockId}>
            {block.questions.map((question, qIndex) => (
              <QuizBlockQuestion
                key={question.questionId}
                question={question}
                questionNumber={index + qIndex + 1}
              />
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
            href={`/courses/${courseId}/topic/${topicId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / {courseDetails?.name} / {content.topicName} / {content.title}
            </span>
          </Link>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar
              progress={sidebarProps.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-5">
            <h1 className="text-xl font-bold text-white md:text-2xl">{content.title}</h1>
            <CompletionButton
              size="sm"
              isCompleted={content.isCompleted}
              isLoading={markComplete.isPending || markIncomplete.isPending}
              onToggle={() => {
                if (content.isCompleted) {
                  markIncomplete.mutate(materiId);
                } else {
                  markComplete.mutate(materiId);
                }
              }}
            />
          </div>

          <div className="p-5 md:p-6">
            {content.blocks.length > 0 ? (
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
              href={`/courses/${courseId}/topic/${topicId}`}
              variant="secondary"
              className="w-full"
            >
              Kembali ke Topik
            </Button>
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar
              progress={sidebarProps.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
