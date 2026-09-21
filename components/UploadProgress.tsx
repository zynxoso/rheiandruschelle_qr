import React from "react";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

interface UploadProgressProps {
  progress: number; // 0 to 100
  statusText?: string;
  isComplete?: boolean;
}

export function UploadProgress({
  progress,
  statusText = "Preserving your memory...",
  isComplete = false,
}: UploadProgressProps) {
  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E9DECB] shadow-lg">
      <div className="flex items-center gap-2 text-[#242D35] font-serif text-sm">
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-[#8DA38B] animate-bounce" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-[#E26D5C]" />
        )}
        <span>{statusText}</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 bg-[#F3EFE6] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#F4A261] via-[#E26D5C] to-[#9B8EB9] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between w-full text-[11px] text-[#7C8793] font-sans">
        <span>{isComplete ? "Uploaded" : "Optimizing & Uploading"}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {isComplete && (
        <div className="flex items-center gap-1.5 text-xs text-[#8DA38B] font-medium pt-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Added to the live wedding gallery!</span>
        </div>
      )}
    </div>
  );
}
