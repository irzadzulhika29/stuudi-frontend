"use client";

import { useState } from "react";
import { X, ChevronRight, Plus } from "lucide-react";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  showAddClass?: boolean;
  onJoinClass?: (code: string) => void;
  onAddClass?: () => void;
  isLoading?: boolean;
  initialCode?: string;
}

export function JoinClassModal({
  isOpen,
  onClose,
  showAddClass = false,
  onJoinClass,
  onAddClass,
  isLoading = false,
  initialCode = "",
}: JoinClassModalProps) {
  const [enrollCode, setEnrollCode] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // React-approved pattern: adjust state during render instead of useEffect
  if (isOpen && !prevIsOpen) {
    setEnrollCode(initialCode || "");
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (enrollCode.trim() && onJoinClass) {
      onJoinClass(enrollCode.trim());
      setEnrollCode("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-scale-in relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <X size={24} />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-neutral-800">Join kelas?</h2>
        <p className="mb-6 text-neutral-500">Silakan masukkan kode enroll</p>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="border-secondary text-secondary hover:bg-secondary/5 group flex w-full items-center justify-between rounded-full border-2 px-6 py-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <input
            type="text"
            value={enrollCode}
            onChange={(e) => setEnrollCode(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Mendaftar..." : "Masukkan kode enroll"}
            className="text-secondary placeholder-secondary/70 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
          />
          {isLoading ? (
            <div className="border-secondary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          ) : (
            <ChevronRight
              size={24}
              className="text-secondary transition-transform group-hover:translate-x-1"
            />
          )}
        </button>

        {showAddClass && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-neutral-400">atau</span>
              </div>
            </div>

            <button
              onClick={onAddClass}
              className="border-secondary text-secondary hover:bg-secondary/5 group flex w-full items-center justify-between rounded-full border-2 px-6 py-4 transition-colors"
            >
              <span className="font-medium">Tambah kelas</span>
              <Plus
                size={24}
                className="text-secondary transition-transform group-hover:rotate-90"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
