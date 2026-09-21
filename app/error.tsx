"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, Sparkles } from "lucide-react";
import { FloralFrame } from "@/components/FloralDecoration";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Wedding Moments App Error:", error);
  }, [error]);

  return (
    <FloralFrame showCorners={true}>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-[#242D35]">
        <div className="max-w-md w-full rounded-3xl bg-white/90 backdrop-blur-md p-8 border border-[#E9DECB] shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#E26D5C]/15 flex items-center justify-center text-[#E26D5C] mb-4">
            <Sparkles className="h-8 w-8" />
          </div>

          <span className="font-serif text-xs uppercase tracking-widest text-[#E26D5C] font-semibold">
            Wedding Moments
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl text-[#242D35] mt-2 font-normal">
            Something unexpected occurred
          </h1>

          <p className="font-serif italic text-sm text-[#7C8793] mt-2 leading-relaxed">
            Please refresh the page to continue sharing in Rhein &amp; Ruschelle&apos;s special day.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-6">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#E26D5C] text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full border border-[#E9DECB] bg-white text-[#242D35] font-semibold text-xs uppercase tracking-wider hover:bg-[#FDFBF7] active:scale-95 transition"
            >
              <Home className="h-4 w-4 text-[#7C8793]" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    </FloralFrame>
  );
}
