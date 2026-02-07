"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard Widget Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    // This is a naive retry; usually, you'd want to trigger a data re-fetch here.
    // In a real app, this might accept a reset function prop.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center backdrop-blur-sm">
          <div className="mb-3 rounded-full bg-red-500/20 p-3 text-red-400">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mb-1 font-semibold text-white">
            Gagal memuat {this.props.title || "Konten"}
          </h3>
          <p className="mb-4 text-xs text-white/60">Terjadi kesalahan pada sistem.</p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            <RefreshCw size={14} />
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
