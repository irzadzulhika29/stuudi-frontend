"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { ManageTopicList } from "@/features/admin/dashboard/courses/components/CourseDetailAdmin";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import { useTeachingCourseDetails } from "../hooks/useTeachingCourseDetails";
import { useAddTopic } from "../hooks/useAddTopic";
import { useUpdateCourse } from "../hooks/useUpdateCourse";
import { useDeleteCourse } from "../hooks/useDeleteCourse";
import { Button } from "@/shared/components/ui";
import { CourseDetailSkeleton } from "@/features/user/dashboard/courses/components/CourseDetailSkeleton";
import { AddTopicModal } from "../components/AddTopicModal";
import { CourseEditForm } from "../components/CourseEditForm";
import { ManagementHeader } from "../components/ManagementHeader";

interface ManageCourseContainerProps {
  courseId: string;
}

export function ManageCourseContainer({ courseId }: ManageCourseContainerProps) {
  const router = useRouter();
  const { setCourseNav } = useCourseNavigation();
  const { data: course, isLoading, isError } = useTeachingCourseDetails(courseId);
  const addTopicMutation = useAddTopic(courseId);
  const updateCourseMutation = useUpdateCourse(courseId);
  const deleteCourseMutation = useDeleteCourse();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  // Local state for form editing
  const [prevCourse, setPrevCourse] = useState<typeof course | null>(null);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  // React-approved pattern: adjust state during render
  if (course && course !== prevCourse) {
    setCourseName(course.name);
    setDescription(course.description);
    setPrevCourse(course);
  }

  useEffect(() => {
    if (course) {
      setCourseNav({ id: courseId, name: course.name }, "/dashboard-admin/courses");
    }
  }, [course, courseId, setCourseNav]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailFile(null);
  };

  const handleOpenAddTopicModal = () => {
    setIsAddTopicModalOpen(true);
  };

  const handleCloseAddTopicModal = () => {
    setIsAddTopicModalOpen(false);
  };

  const handleAddTopic = (title: string, description: string) => {
    addTopicMutation.mutate(
      {
        title,
        description,
      },
      {
        onSuccess: () => {
          handleCloseAddTopicModal();
        },
      }
    );
  };

  const handleApplyEdit = () => {
    console.log("Applying edit...");
    console.log("Data:", { name: courseName, description: description, photo: thumbnailFile });

    updateCourseMutation.mutate(
      {
        name: courseName,
        description: description,
        photo: thumbnailFile,
      },
      {
        onSuccess: (data) => {
          console.log("Update success:", data);
          setThumbnailFile(null);
          // Redirect to course detail
          router.push(`/dashboard-admin/courses/${courseId}`);
        },
        onError: (error) => {
          console.error("Update failed:", error);
          console.error("Error response:", error.response?.data);
        },
      }
    );
  };

  const handleDeleteCourse = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus course ini? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      deleteCourseMutation.mutate(courseId, {
        onSuccess: () => {
          alert("Course berhasil dihapus.");
          router.push("/dashboard-admin/courses");
        },
        onError: (error) => {
          console.error("Failed to delete course:", error);
          alert("Gagal menghapus course. Silakan coba lagi.");
        },
      });
    }
  };

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

  // Transform topics for ManageTopicList
  const transformedTopics =
    course.topics?.map((topic) => ({
      id: topic.topic_id,
      title: topic.title,
      description: topic.description,
      status: topic.status,
      materials:
        topic.contents?.map((m) => ({
          id: m.content_id,
          title: m.title,
          type: (m.type === "materi" ? "material" : "quiz") as "material" | "quiz",
          duration: "",
          isCompleted: m.is_completed,
        })) || [],
    })) || [];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <ManagementHeader
            courseId={courseId}
            onDelete={handleDeleteCourse}
            onSave={handleApplyEdit}
            isDeleting={deleteCourseMutation.isPending}
            isSaving={updateCourseMutation.isPending}
          />

          <CourseEditForm
            name={courseName}
            onNameChange={setCourseName}
            description={description}
            onDescriptionChange={setDescription}
            thumbnailFile={thumbnailFile}
            thumbnailPreview={thumbnailPreview}
            existingThumbnailUrl={course.image_url}
            onThumbnailChange={handleThumbnailChange}
            onThumbnailRemove={handleRemoveThumbnail}
          />

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...sidebarProps} />
          </div>

          <div>
            <ManageTopicList
              courseId={courseId}
              topics={transformedTopics}
              onAddNewTopic={handleOpenAddTopicModal}
            />
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...sidebarProps} />
          </div>
        </div>
      </div>

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={handleCloseAddTopicModal}
        onAdd={handleAddTopic}
      />
    </div>
  );
}
