"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

export interface ExamCardProps {
  examId: string;
  courseId: string;
  title: string;
  description: string;
}

export function ExamCard({ examId, courseId, title, description }: ExamCardProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Link
        href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/exam/${examId}`}
        className="flex cursor-pointer items-start gap-4 border-l-4 border-amber-500 bg-white p-5 transition-colors duration-200 hover:bg-neutral-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-primary-dark hover:text-primary-light mb-1.5 text-lg font-semibold transition-colors duration-200">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500">{description}</p>
        </div>
      </Link>
    </div>
  );
}
