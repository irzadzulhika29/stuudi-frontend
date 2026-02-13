"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import Button from "@/shared/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Something went wrong</h2>
            <p className="mb-6 text-sm text-white/70">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
