"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { MaterialContentBox } from "./MaterialContentBox";

interface MediaBoxProps {
  id: string;
  file: File | null;
  embedUrl: string;
  onFileChange: (id: string, file: File | null) => void;
  onEmbedUrlChange: (id: string, url: string) => void;
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
  onFileChange,
  onEmbedUrlChange,
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
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(id, droppedFile);
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
            className="flex items-center gap-2 text-white font-medium hover:text-primary/80 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>Unggah Media</span>
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
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
                className={`flex items-center gap-3 px-4 py-3 bg-transparent border border-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                  file ? "border-2 border-success" : ""
                }`}
              >
                <Upload className="w-5 h-5 text-white" />
                <span className="text-white text-sm">
                  {file
                    ? file.name
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-error/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-neutral-gray/30"></div>
              <span className="text-sm text-neutral-gray">atau</span>
              <div className="flex-1 h-px bg-neutral-gray/30"></div>
            </div>

            {/* Embed URL */}
            <div className="space-y-2">
              <label className="text-sm text-white font-medium">
                Masukkan Embed URL (Youtube Support)
              </label>
              <div className="flex border border-white items-center gap-3 px-4 py-3 bg-transparent rounded-lg">
                <input
                  type="url"
                  value={embedUrl}
                  onChange={(e) => onEmbedUrlChange(id, e.target.value)}
                  placeholder="Masukkan Alamat URL disini"
                  className="flex-1 bg-transparent text-white placeholder:text-white/60 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MaterialContentBox>
  );
}
