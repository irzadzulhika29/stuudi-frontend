import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", rightIcon, onRightIconClick, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`w-full px-5 py-3 rounded-xl bg-white border ${
            error ? "border-red-500" : "border-transparent"
          } focus:border-[#27A8F3] focus:ring-2 focus:ring-[#27A8F3]/20 focus:outline-none transition-all shadow-sm placeholder:text-gray-400 text-gray-800 ${
            rightIcon ? "pr-12" : ""
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {rightIcon}
          </button>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
