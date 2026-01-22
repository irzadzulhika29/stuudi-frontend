"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSubmitModal({ isOpen, onClose, onConfirm }: ConfirmSubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
        </div>

        <h2 className="mb-3 text-center text-2xl font-bold text-white">Akhiri Ujian?</h2>

        <p className="mb-8 text-center text-white/60">
          Setelah mengakhiri ujian, Anda tidak dapat mengubah jawaban lagi. Pastikan semua jawaban
          sudah benar.
        </p>

        <div className="flex gap-4">
          <Button variant="outline" size="md" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} className="flex-1">
            Ya, Akhiri Ujian
          </Button>
        </div>
      </div>
    </div>
  );
}
