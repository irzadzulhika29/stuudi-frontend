"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { MaterialContentBox } from "./MaterialContentBox";

interface MediaBoxProps {
  id: string;
  file: File | null;
  embedUrl: string;
  previewUrl?: string;
  onFileChange: (id: string, file: File | null) => void;
  onEmbedUrlChange: (id: string, url: string) => void;
  onClearPreview?: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function MediaBox({
  id,
  file,
  embedUrl,
  previewUrl,
  onFileChange,
  onEmbedUrlChange,
  onClearPreview,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: MediaBoxProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(id, selectedFile);
      // Clear preview when new file is selected
      if (onClearPreview) {
        onClearPreview(id);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(id, droppedFile);
      // Clear preview when new file is dropped
      if (onClearPreview) {
        onClearPreview(id);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <MaterialContentBox
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-primary/80 flex items-center gap-2 font-medium text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>Unggah Media</span>
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Preview Image (for edit mode) */}
            {previewUrl && !file && (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview media"
                  className="max-h-48 max-w-full rounded-lg border border-white/20 object-contain"
                />
                <button
                  type="button"
                  onClick={() => onClearPreview?.(id)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                  title="Hapus preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* File Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className={`flex cursor-pointer items-center gap-3 rounded-lg border border-white bg-transparent px-4 py-3 transition-opacity hover:opacity-90 ${
                  file ? "border-success border-2" : ""
                }`}
              >
                <Upload className="h-5 w-5 text-white" />
                <span className="text-sm text-white">
                  {file
                    ? file.name
                    : previewUrl
                      ? "Pilih file baru untuk mengganti gambar"
                      : "Pilih file untuk di unggah (.PNG, .JPG, atau .WEBP)"}
                </span>
              </div>
              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(id, null);
                  }}
                  className="hover:bg-error/20 absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4">
              <div className="bg-neutral-gray/30 h-px flex-1"></div>
              <span className="text-neutral-gray text-sm">atau</span>
              <div className="bg-neutral-gray/30 h-px flex-1"></div>
            </div>

            {/* Embed URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Masukkan Embed URL (Youtube Support)
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-white bg-transparent px-4 py-3">
                <input
                  type="url"
                  value={embedUrl}
                  onChange={(e) => onEmbedUrlChange(id, e.target.value)}
                  placeholder="Masukkan Alamat URL disini"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MaterialContentBox>
  );
}
