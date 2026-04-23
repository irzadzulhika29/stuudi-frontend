"use client";

import Button from "@/shared/components/ui/Button";

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ConfirmSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ConfirmSubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
        <p className="text-center text-[11px] font-medium tracking-[0.18em] text-neutral-400 uppercase">
          Konfirmasi Submit
        </p>
        <h2 className="mt-3 mb-3 text-center text-2xl font-semibold text-neutral-950">
          Akhiri ujian?
        </h2>

        <p className="mb-8 text-center text-neutral-600">
          Setelah mengakhiri ujian, Anda tidak dapat mengubah jawaban lagi. Pastikan semua jawaban
          sudah benar.
        </p>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1 border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mengirim..." : "Ya, Akhiri Ujian"}
          </Button>
        </div>
      </div>
    </div>
  );
}
