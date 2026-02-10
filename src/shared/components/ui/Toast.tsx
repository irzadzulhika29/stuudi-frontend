"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import "./styles/toast.css";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  showProgress?: boolean;
  duration?: number;
  onComplete?: () => void;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showProgressToast: (message: string, duration?: number, onComplete?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const showProgressToast = useCallback(
    (message: string, duration: number = 2000, onComplete?: () => void) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: Toast = {
        id,
        message,
        type: "success",
        showProgress: true,
        duration,
        onComplete,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        onComplete?.();
      }, duration);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showProgressToast }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.showProgress && toast.duration) {
      const interval = 10;
      const decrement = (100 * interval) / toast.duration;

      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev - decrement;
          return next <= 0 ? 0 : next;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [toast.showProgress, toast.duration]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  };

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  };

  const progressColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`animate-slide-in-right pointer-events-auto flex flex-col overflow-hidden rounded-xl border shadow-lg ${styles[toast.type]}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={iconColors[toast.type]}>{icons[toast.type]}</div>
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
        {!toast.showProgress && (
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {toast.showProgress && (
        <div className="h-1 w-full bg-gray-200">
          <div
            className={`h-full transition-all duration-100 ease-linear ${progressColors[toast.type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
