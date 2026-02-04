"use client";

interface ExamUpdateWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExamUpdateWarning({ onConfirm, onCancel }: ExamUpdateWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-neutral-800">Update Metadata Exam Saja?</h3>
        <div className="mb-6 space-y-2 text-neutral-600">
          <p>
            Saat ini, update soal exam memiliki kendala teknis di backend yang sedang kami perbaiki.
          </p>
          <p className="font-medium">Anda memiliki 2 pilihan:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Update Metadata Saja:</strong> Hanya mengupdate informasi exam (judul,
              deskripsi, durasi, dll) tanpa mengubah soal
            </li>
            <li>
              <strong>Batalkan:</strong> Kembali ke form dan coba lagi nanti setelah masalah
              diperbaiki
            </li>
          </ul>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            Batalkan
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Update Metadata Saja
          </button>
        </div>
      </div>
    </div>
  );
}
