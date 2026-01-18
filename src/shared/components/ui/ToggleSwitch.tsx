"use client";

import { forwardRef } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      labelPosition = "left",
      size = "md",
      disabled = false,
      className = "",
    },
    ref,
  ) => {
    const sizes = {
      sm: {
        track: "w-8 h-4",
        thumb: "w-3 h-3",
        translate: "translate-x-4",
        labelText: "text-xs",
      },
      md: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translate-x-5",
        labelText: "text-sm",
      },
      lg: {
        track: "w-14 h-7",
        thumb: "w-6 h-6",
        translate: "translate-x-7",
        labelText: "text-base",
      },
    };

    const currentSize = sizes[size];

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const toggle = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={`relative ${currentSize.track} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          checked ? "bg-primary" : "bg-neutral-gray/30"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 ${currentSize.thumb} bg-white rounded-full shadow-md transition-all duration-200 ${
            checked ? currentSize.translate : "translate-x-0"
          }`}
        />
      </button>
    );

    if (!label) {
      return toggle;
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {labelPosition === "left" && (
          <span
            className={`${currentSize.labelText} text-neutral-dark ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </span>
        )}
        {toggle}
        {labelPosition === "right" && (
          <span
            className={`${currentSize.labelText} text-neutral-dark ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";

export default ToggleSwitch;
