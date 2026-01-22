"use client";

import { useState } from "react";
import { Copy, Check, KeyRound } from "lucide-react";

interface CourseEnrollCodeProps {
  enrollCode: string;
}

export const CourseEnrollCode = ({ enrollCode }: CourseEnrollCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enrollCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-light">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound className="text-primary-light" size={18} />
        <h3 className="font-semibold text-primary-dark text-sm">Enroll Code</h3>
      </div>
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
        <code className="font-mono font-bold text-primary-dark text-lg tracking-wider">
          {enrollCode}
        </code>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-gray-200 rounded-md transition-colors"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="text-emerald-500" size={18} />
          ) : (
            <Copy className="text-gray-500" size={18} />
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Share this code with students to let them join the class
      </p>
    </section>
  );
};
