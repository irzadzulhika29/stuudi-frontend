"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";

const materiData = {
  id: "1",
  title: "Kata Pengantar",
  content: `
    <h2>Selamat Datang di Materi Pembelajaran</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.</p>
    <p>Etiam semper, lacus id vulputate blandit, nunc libero imperdiet sem, varius luctus lorem sapien nec ex. Curabitur sollicitudin nisi nec eleifend dignissim.</p>
    <h3>Tujuan Pembelajaran</h3>
    <ul>
      <li>Memahami konsep dasar</li>
      <li>Mengaplikasikan teori ke praktik</li>
      <li>Menyelesaikan studi kasus</li>
    </ul>
    <p>Pelajari materi ini dengan seksama sebelum melanjutkan ke materi berikutnya. Jika ada pertanyaan, silakan hubungi pengajar melalui forum diskusi.</p>
  `,
};

const topicData = {
  id: "1",
  title: "Topic 1",
};

interface MateriDetailContainerProps {
  courseId: string;
  topicId: string;
  materiId: string;
}

export function MateriDetailContainer({
  courseId,
  topicId,
  materiId,
}: MateriDetailContainerProps) {
  const { setMateriNav } = useCourseNavigation();

  useEffect(() => {
    setMateriNav(
      { id: courseId, name: "Course Details" },
      { id: topicId, name: topicData.title },
      { id: materiId, name: materiData.title }
    );
  }, [courseId, topicId, materiId, setMateriNav]);

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/courses/${courseId}/topic/${topicId}`}
          className="inline-flex items-center gap-2 text-white/70 mb-6 transition-colors duration-200 hover:text-white"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Kembali ke {topicData.title}</span>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-800 mb-6">
            {materiData.title}
          </h1>

          <div
            className="prose prose-neutral prose-sm max-w-none prose-headings:text-neutral-800 prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-p:text-neutral-600 prose-li:text-neutral-600"
            dangerouslySetInnerHTML={{ __html: materiData.content }}
          />

          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-neutral-100">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 text-neutral-600 rounded-lg text-sm transition-colors duration-200 hover:bg-neutral-50 hover:border-neutral-300">
              <ChevronLeft size={16} />
              <span>Sebelumnya</span>
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-default text-white rounded-lg text-sm transition-colors duration-200 hover:bg-secondary-dark">
              <span>Selanjutnya</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
