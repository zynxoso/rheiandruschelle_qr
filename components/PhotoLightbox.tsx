"use client";

import React, { useEffect } from "react";
import { X, Download, Trash2, Calendar, User } from "lucide-react";
import { getPhotoPublicUrl } from "@/lib/supabase/client";
import type { Photo } from "@/types/database";

interface PhotoLightboxProps {
  photo: Photo | null;
  isAdmin?: boolean;
  onClose: () => void;
  onDelete?: (photo: Photo) => void;
}

export function PhotoLightbox({
  photo,
  isAdmin = false,
  onClose,
  onDelete,
}: PhotoLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (photo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const publicUrl = getPhotoPublicUrl(photo.storage_path);
  const formattedDate = new Date(photo.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `wedding_moment_${photo.id.slice(0, 8)}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(publicUrl, "_blank");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Lightbox Header Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent text-white z-10">
        <div className="flex items-center gap-2 text-xs text-[#E9DECB]">
          <Calendar className="h-3.5 w-3.5 text-[#F3CA68]" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download wedding photo"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/25 transition active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Admin Delete Action */}
          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(photo)}
              aria-label="Delete wedding photo"
              className="flex items-center gap-1.5 rounded-full bg-red-600/80 px-3 py-1.5 text-xs text-white hover:bg-red-700 transition active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo preview"
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden cursor-zoom-out"
        onClick={onClose}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicUrl}
          alt={photo.caption || "Wedding guest moment"}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl cursor-default"
        />
      </div>

      {/* Caption Bar (if present) */}
      {photo.caption && (
        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent text-center text-white/90 text-sm font-serif italic z-10">
          “{photo.caption}”
        </div>
      )}
    </div>
  );
}
