import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/features/user/courses/services/courseService";
import { useToast } from "@/shared/components/ui/Toast";

interface UseUnenrollCourseOptions {
  courseId: string;
  onSuccess?: () => void;
}

/**
 * Hook to handle unenrolling from a course.
 * Provides mutation state and modal controls.
 */
export function useUnenrollCourse({ courseId, onSuccess }: UseUnenrollCourseOptions) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: () => courseService.unenrollCourse(courseId),
    onSuccess: () => {
      showToast("Berhasil keluar dari kursus", "success");
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
      setShowConfirmModal(false);
      onSuccess?.();
    },
    onError: () => {
      showToast("Gagal keluar dari kursus", "error");
      setShowConfirmModal(false);
    },
  });

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);
  const confirmUnenroll = () => mutation.mutate();

  return {
    showConfirmModal,
    openConfirmModal,
    closeConfirmModal,
    confirmUnenroll,
    isPending: mutation.isPending,
  };
}
