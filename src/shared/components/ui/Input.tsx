import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      rightIcon,
      onRightIconClick,
      error,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate a default ID for the error message if none is provided but error exists
    const errorId = error ? ariaDescribedBy || `${props.id || props.name}-error` : undefined;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`w-full rounded-xl border bg-white px-5 py-3 ${
            error ? "border-red-500" : "border-transparent"
          } focus:border-secondary focus:ring-secondary/20 text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:ring-2 focus:outline-none ${
            rightIcon ? "pr-12" : ""
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            aria-label={props.type === "password" ? "Show password" : "Hide password"}
          >
            {rightIcon}
          </button>
        )}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
