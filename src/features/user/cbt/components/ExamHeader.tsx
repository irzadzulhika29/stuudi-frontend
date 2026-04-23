"use client";

interface ExamHeaderProps {
  title: string;
  subject?: string;
}

export function ExamHeader({ title, subject }: ExamHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-400 uppercase">
          CBT Session
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-950 md:text-[2rem]">{title}</h1>
        {subject ? <p className="mt-1 text-sm text-neutral-500">{subject}</p> : null}
      </div>
    </header>
  );
}
