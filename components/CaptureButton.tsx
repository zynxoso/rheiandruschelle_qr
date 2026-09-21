import React from "react";

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isCapturing?: boolean;
}

export function CaptureButton({
  onClick,
  disabled = false,
  isCapturing = false,
}: CaptureButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer subtle glow / decorative ring */}
      <div className="absolute h-24 w-24 rounded-full border border-white/40 animate-ping opacity-25 pointer-events-none" />

      {/* Main Shutter Button Frame */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isCapturing}
        aria-label="Capture wedding photo"
        className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
      >
        {/* Inner Solid Shutter Core */}
        <div
          className={`h-16 w-16 rounded-full bg-white transition-all duration-200 group-hover:scale-95 group-active:scale-90 group-active:bg-[#E26D5C] ${
            isCapturing ? "scale-75 bg-[#E26D5C]" : ""
          }`}
        />
      </button>
    </div>
  );
}
