import React from "react";
import Link from "next/link";
import { Home, Heart } from "lucide-react";
import { FloralFrame } from "@/components/FloralDecoration";

export default function NotFound() {
  return (
    <FloralFrame showCorners={true}>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-[#242D35]">
        <div className="max-w-md w-full rounded-3xl bg-white/90 backdrop-blur-md p-8 border border-[#E9DECB] shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#E26D5C]/15 flex items-center justify-center text-[#E26D5C] mb-4">
            <Heart className="h-8 w-8 fill-[#E26D5C]" />
          </div>

          <span className="font-serif text-xs uppercase tracking-widest text-[#E26D5C] font-semibold">
            Wedding Moments
          </span>

          <h1 className="font-serif text-3xl text-[#242D35] mt-2 font-normal">
            Page Not Found
          </h1>

          <p className="font-serif italic text-sm text-[#7C8793] mt-2 leading-relaxed">
            The wedding page or memory you are looking for is not available or has expired.
          </p>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#E26D5C] text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition"
          >
            <Home className="h-4 w-4" />
            <span>Return to Wedding Moments</span>
          </Link>
        </div>
      </div>
    </FloralFrame>
  );
}
