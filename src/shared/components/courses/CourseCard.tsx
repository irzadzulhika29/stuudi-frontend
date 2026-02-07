"use client";

import Image from "next/image";
import { Calendar, CheckCircle2, BookOpen, MoreHorizontal, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { CircularProgress } from "./CircularProgress";
import { useUnenrollCourse } from "@/shared/hooks/useUnenrollCourse";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  progress: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  enrolledAt?: string;
  studentCount?: number;
  onClick?: () => void;
  /** Base path for the link, e.g., "/courses" or "/dashboard-admin/courses" */
  basePath?: string;
  /** Whether to show unenroll menu (default: true for user, false for admin teaching) */
  showUnenrollMenu?: boolean;
}

function formatEnrolledDate(dateString?: string): string {
  if (!dateString) return "";

  const enrolled = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - enrolled.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `${diffDays} hari lalu`;
  if (diffDays === 1) return "1 hari lalu";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}

export function CourseCard({
  id,
  title,
  thumbnail,
  description,
  progress,
  isEnrolled,
  isCompleted,
  enrolledAt,
  studentCount,
  onClick,
  basePath = "/courses",
  showUnenrollMenu = true,
}: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const { showConfirmModal, openConfirmModal, closeConfirmModal, confirmUnenroll, isPending } =
    useUnenrollCourse({ courseId: id });

  const enrolledText = useMemo(() => formatEnrolledDate(enrolledAt), [enrolledAt]);
  const truncatedDescription = useMemo(() => {
    if (!description) return "";
    return description.length > 120 ? description.slice(0, 120) + "..." : description;
  }, [description]);

  const CardContent = (
    <div className="relative h-full">
      <motion.div
        onClick={onClick}
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-md sm:p-4"
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2 sm:top-5 sm:left-5">
          {isCompleted && (
            <div className="flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm sm:px-3 sm:py-1">
              <CheckCircle2 size={12} />
              <span className="hidden sm:inline">Selesai</span>
            </div>
          )}
          {isEnrolled && !isCompleted && (
            <div className="bg-secondary-default/90 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur-sm sm:px-3 sm:py-1">
              Enrolled
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-800">
          <Image
            src={thumbnail || "/images/dummycardimage.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {description && (
            <div
              className="absolute inset-0 flex items-end bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
              style={{ willChange: "opacity" }}
            >
              <p className="translate-y-2 text-xs leading-relaxed text-white/90 transition-transform duration-300 ease-out group-hover:translate-y-0 sm:text-sm">
                {truncatedDescription}
              </p>
            </div>
          )}

          {!description && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-12 sm:w-12">
                <BookOpen className="text-white" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 items-stretch gap-4 pt-3 pr-1 pl-1 sm:pt-4">
          <div className="flex w-[65%] flex-col justify-between">
            <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors duration-200 group-hover:text-orange-400 sm:text-base">
              {title}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/50 sm:text-xs">
              {studentCount !== undefined ? (
                <>
                  <Users size={12} className="sm:h-3.5 sm:w-3.5" />
                  <span>{studentCount} students</span>
                </>
              ) : enrolledAt ? (
                <>
                  <Calendar size={12} className="sm:h-3.5 sm:w-3.5" />
                  <span>{enrolledText}</span>
                </>
              ) : (
                <span className="text-white/30">{progress}% selesai</span>
              )}
            </div>
          </div>

          <div className="flex w-[35%] items-center justify-end">
            <div className="scale-110 transform sm:scale-125">
              <CircularProgress progress={progress} />
            </div>
          </div>
        </div>

        {/* Unenroll Menu */}
        {showUnenrollMenu && isEnrolled && (
          <div className="group absolute top-4 right-4 z-30 sm:top-5 sm:right-5">
            <div className="group relative transition-all duration-500 group-hover:scale-105">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="flex h-4 w-8 cursor-pointer items-center justify-center rounded-2xl text-white backdrop-blur-sm transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 p-1 shadow-xl backdrop-blur-md">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                        openConfirmModal();
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
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={confirmUnenroll}
        title="Keluar dari Kursus"
        message="Apakah Anda yakin ingin keluar dari kursus ini? Progres belajar Anda akan tetap tersimpan history-nya namun Anda tidak akan terdaftar lagi."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );

  // Link to course detail
  if (isEnrolled && !onClick) {
    return <Link href={`${basePath}/${id}`}>{CardContent}</Link>;
  }

  return CardContent;
}
