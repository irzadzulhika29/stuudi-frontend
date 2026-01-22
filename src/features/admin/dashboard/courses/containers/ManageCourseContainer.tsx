"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Trash2, Folder, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { ManageTopicList } from "@/features/admin/dashboard/courses/components/CourseDetailAdmin";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import {
  courseData as initialCourseData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";
import { Button, Input } from "@/shared/components/ui";
import { Modal } from "@/shared/components/ui/Modal";

interface ManageCourseContainerProps {
  courseId: string;
}

export function ManageCourseContainer({
  courseId,
}: ManageCourseContainerProps) {
  const { setCourseNav } = useCourseNavigation();
  const [courseName, setCourseName] = useState(initialCourseData.title);
  const [description, setDescription] = useState(initialCourseData.description);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCourseNav({ id: courseId, name: "Manage Course" });
  }, [courseId, setCourseNav]);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenAddTopicModal = () => {
    setIsAddTopicModalOpen(true);
  };

  const handleCloseAddTopicModal = () => {
    setIsAddTopicModalOpen(false);
    setNewTopicName("");
    setNewTopicDescription("");
  };

  const handleAddTopic = () => {
    // TODO: Implement actual add topic logic
    console.log("Adding topic:", { name: newTopicName, description: newTopicDescription });
    handleCloseAddTopicModal();
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/dashboard-admin/courses/${courseId}`}
              className="w-10 h-10 bg-[#FF9D00] rounded-full flex items-center justify-center text-white hover:bg-[#E68E00] transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <span className="text-white text-lg">Course/Course Details</span>
          </div>

          {/* Header Actions */}
          <div className="flex justify-end mb-6 gap-3">
            <button className="text-white/80 hover:text-white transition-colors p-2">
              <Trash2 size={24} />
            </button>
            <Button
              variant="outline"
              className="text-white border-white bg-transparent hover:bg-white hover:text-black rounded-full px-8"
            >
              Apply edit
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Nama Courses
              </label>
              <div className="bg-white p-1 rounded-xl">
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Deskripsi Courses
              </label>
              <div className="bg-white p-1 rounded-xl">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-transparent border-none focus:outline-none resize-none h-32 placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Thumbnail Course
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <div
                  onClick={handleThumbnailClick}
                  className="bg-white p-1 rounded-xl cursor-pointer"
                >
                  <Input
                    placeholder={thumbnailFile?.name || "Pilih File"}
                    rightIcon={<Folder size={20} />}
                    className="bg-transparent border-none focus:ring-0 placeholder:text-black cursor-pointer"
                    readOnly
                  />
                </div>
              </div>
              
              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <div className="relative mt-4 inline-block">
                  <div className="relative w-64 h-40 rounded-xl overflow-hidden border-2 border-white/20">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden mb-6">
            <CourseInfoSidebar {...courseInfoData} />
          </div>

          <div className="">
            <ManageTopicList
              courseId={courseId}
              topics={initialCourseData.topics}
              onAddNewTopic={handleOpenAddTopicModal}
            />
          </div>
        </div>

        <div className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...courseInfoData} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddTopicModalOpen}
        onClose={handleCloseAddTopicModal}
        title="Tambah Topic Baru"
        size="xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Nama Topic
            </label>
            <Input
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Masukkan nama topic"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Deskripsi Topic
            </label>
            <textarea
              value={newTopicDescription}
              onChange={(e) => setNewTopicDescription(e.target.value)}
              placeholder="Masukkan deskripsi topic"
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] focus:border-transparent resize-none h-32"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseAddTopicModal}
              className="px-6"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddTopic}
              className="px-6 bg-[#D77211] hover:bg-[#C06010]"
              disabled={!newTopicName.trim()}
            >
              Tambah Topic
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
