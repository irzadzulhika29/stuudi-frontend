import Image from "next/image";
import { Users } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  studentCount: number;
  progress: number;
}

function CircularProgress({ progress }: { progress: number }) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="transform -rotate-90"
    >
      <circle
        cx="16"
        cy="16"
        r={radius}
        fill="none"
        stroke="#E5E5E5"
        strokeWidth="4"
      />
      <circle
        cx="16"
        cy="16"
        r={radius}
        fill="none"
        stroke="#EA7D17"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CourseCard({
  id,
  title,
  thumbnail,
  studentCount,
  progress,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border-2 border-secondary-default/30 hover:border-secondary-default hover:shadow-xl transition-all duration-300 cursor-pointer p-4">
        <div className="relative h-32 bg-secondary-light overflow-hidden rounded-xl">
          <Image
            src={thumbnail || "/images/dummycardimage.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="pt-4 space-y-4">
          <h3 className="font-bold text-xl text-neutral-900">{title}</h3>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Users size={16} />
              <span>{studentCount} students</span>
            </div>

            <div className="flex items-center gap-2 text-secondary-default font-medium">
              <CircularProgress progress={progress} />
              <span>
                <span className="font-bold">{progress}%</span>
                <span className="text-neutral-500 font-normal ml-1">
                  progress
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
