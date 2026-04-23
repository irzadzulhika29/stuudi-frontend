"use client";

import { useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Modal } from "@/shared/components/ui";

interface CropResult {
  file: File;
  previewUrl: string;
}

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  imageType?: string;
  onClose: () => void;
  onApply: (result: CropResult) => void;
}

function getFileExtension(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

async function createCroppedFile(
  imageSrc: string,
  pixelCrop: Area,
  mimeType: string
): Promise<CropResult> {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Gagal memuat gambar untuk crop."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas tidak tersedia untuk proses crop.");
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), mimeType, 0.92);
  });

  if (!blob) {
    throw new Error("Gagal membuat file hasil crop.");
  }

  const extension = getFileExtension(mimeType);
  const file = new File([blob], `question-image-crop.${extension}`, { type: mimeType });
  const previewUrl = URL.createObjectURL(file);

  return { file, previewUrl };
}

export function ImageCropModal({
  isOpen,
  imageSrc,
  imageType = "image/jpeg",
  onClose,
  onApply,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeMimeType = useMemo(() => {
    if (imageType === "image/png" || imageType === "image/webp" || imageType === "image/jpeg") {
      return imageType;
    }
    return "image/jpeg";
  }, [imageType]);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsApplying(true);
    setError(null);
    try {
      const result = await createCroppedFile(imageSrc, croppedAreaPixels, safeMimeType);
      onApply(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal melakukan crop gambar.";
      setError(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(4 / 3);
    setCroppedAreaPixels(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crop Gambar Soal" size="xl">
      <div className="space-y-4">
        <div className="relative h-[320px] overflow-hidden rounded-xl bg-neutral-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              objectFit="contain"
            />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Rasio</label>
            <select
              value={aspect}
              onChange={(e) => setAspect(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-[#D77211]"
            >
              <option value={1}>1 : 1</option>
              <option value={4 / 3}>4 : 3</option>
              <option value={16 / 9}>16 : 9</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !croppedAreaPixels}
            className="rounded-lg bg-[#D77211] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#C06010] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying ? "Memproses..." : "Gunakan Hasil Crop"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
