"use client";

import { Modal } from "@/shared/components/ui/Modal";
import { ParticipantCSVRow } from "./CSVUploadPreview";

interface CSVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ParticipantCSVRow[];
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function CSVPreviewModal({
  isOpen,
  onClose,
  data,
  onSubmit,
  isSubmitting = false,
}: CSVPreviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Import Data" size="xl">
      <div className="space-y-4">
        {/* Info */}
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <strong>{data.length}</strong> tim akan diimport. Periksa data di bawah sebelum submit.
        </div>

        {/* Preview Table */}
        <div className="max-h-80 overflow-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-neutral-100">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">#</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">
                  Asal Sekolah
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">
                  Nama Tim
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">
                  Nama Ketua
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">
                  Anggota 1
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-neutral-700">
                  Anggota 2
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-700">
                    {row.asalSekolah}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-neutral-900">
                    {row.namaTim}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-700">{row.namaKetua}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                    {row.namaAnggota1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                    {row.namaAnggota2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/80 cursor-pointer rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : `Submit ${data.length} Teams`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
