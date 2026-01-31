"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

export interface ParticipantCSVRow {
  asalSekolah: string;
  namaTim: string;
  namaKetua: string;
  namaAnggota1: string;
  namaAnggota2: string;
}

interface CSVUploadButtonProps {
  onFileSelected: (file: File, previewData: ParticipantCSVRow[]) => void;
  onError?: (error: string) => void;
}

export function CSVUploadButton({ onFileSelected, onError }: CSVUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSVForPreview = (csvText: string): ParticipantCSVRow[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    // Skip header row
    const dataLines = lines.slice(1);
    const result: ParticipantCSVRow[] = [];

    for (const line of dataLines) {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      if (values.length >= 5) {
        result.push({
          asalSekolah: values[0] || "",
          namaTim: values[1] || "",
          namaKetua: values[2] || "",
          namaAnggota1: values[3] || "",
          namaAnggota2: values[4] || "",
        });
      }
    }

    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      onError?.("Please upload a CSV file");
      return;
    }

    // Read file for preview only
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const previewData = parseCSVForPreview(csvText);
      if (previewData.length === 0) {
        onError?.("No valid data found in CSV");
        return;
      }
      // Pass both the original file and preview data
      onFileSelected(file, previewData);
    };
    reader.onerror = () => {
      onError?.("Failed to read file");
    };
    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-600"
      >
        <Upload size={16} />
        Upload CSV
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
