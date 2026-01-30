"use client";

import { AlertTriangle, Info, CheckCircle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

type ConfirmVariant = "danger" | "warning" | "info" | "success";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "danger",
}: ConfirmModalProps) {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          Icon: AlertTriangle,
        };
      case "warning":
        return {
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          Icon: AlertTriangle,
        };
      case "success":
        return {
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          buttonBg: "bg-emerald-600 hover:bg-emerald-700",
          Icon: CheckCircle,
        };
      case "info":
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          Icon: Info,
        };
    }
  };

  const { iconBg, iconColor, buttonBg, Icon } = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>

        <h3 className="mb-2 text-lg font-bold text-neutral-800">{title}</h3>
        <p className="mb-6 text-sm text-neutral-600">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${buttonBg}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Proses...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
