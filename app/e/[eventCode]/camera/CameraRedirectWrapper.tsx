"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Image as ImageIcon, Camera as CameraIcon } from "lucide-react";
import { Camera } from "@/components/Camera";

interface CameraRedirectWrapperProps {
  eventId: string;
  eventCode: string;
  coupleNames: string;
}

export function CameraRedirectWrapper({
  eventId,
  eventCode,
  coupleNames,
}: CameraRedirectWrapperProps) {
  const router = useRouter();
  const [uploadedPhotoId, setUploadedPhotoId] = useState<string | null>(null);

  const handlePhotoUploaded = (photoId: string) => {
    setUploadedPhotoId(photoId);
  };

  const handleTakeAnother = () => {
    setUploadedPhotoId(null);
  };

  if (uploadedPhotoId) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#FDFBF7] p-6 text-center text-[#242D35]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#8DA38B]/20 text-[#8DA38B] mb-6 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="font-serif text-xs uppercase tracking-widest text-[#E26D5C] font-semibold">
          Moment Preserved
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#242D35] mt-2 max-w-xs">
          Your moment has been added to the wedding gallery
        </h2>

        <p className="font-serif italic text-sm text-[#7C8793] mt-3 max-w-sm">
          Thank you for sharing this beautiful memory with {coupleNames}.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mt-8">
          <button
            type="button"
            onClick={handleTakeAnother}
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full border border-[#E9DECB] bg-white text-[#242D35] font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-[#FDFBF7] active:scale-95 transition"
          >
            <CameraIcon className="h-4 w-4 text-[#E26D5C]" />
            <span>Take Another</span>
          </button>

          <Link
            href={`/e/${eventCode}/gallery`}
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#E26D5C] text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition"
          >
            <ImageIcon className="h-4 w-4" />
            <span>View Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Camera
      eventId={eventId}
      eventCode={eventCode}
      coupleNames={coupleNames}
      onPhotoUploaded={handlePhotoUploaded}
    />
  );
}
