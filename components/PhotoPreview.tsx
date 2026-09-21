import React, { useState } from "react";
import Image from "next/image";
import { RotateCcw, UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { UploadProgress } from "@/components/UploadProgress";
import { compressImage, type CompressionResult } from "@/lib/image/compress";
import { createClient, getOrCreateGuestSession } from "@/lib/supabase/client";

interface PhotoPreviewProps {
  imageBlob: Blob;
  previewUrl: string;
  eventId: string;
  eventCode: string;
  onRetake: () => void;
  onUploaded: (photoId: string) => void;
}

export function PhotoPreview({
  imageBlob,
  previewUrl,
  eventId,
  eventCode: _eventCode,
  onRetake,
  onUploaded,
}: PhotoPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E26D5C", "#9B8EB9", "#8FA8CF", "#F3CA68", "#8DA38B"],
      });
    } catch {
      // Confetti is decorative
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(15);
    setStatusMessage("Compressing & optimizing photo...");

    try {
      // 1. Client-side Image Compression to WebP (max 1600px, 0.80 quality)
      const compressed = await compressImage(imageBlob, {
        maxDimension: 1600,
        quality: 0.8,
      });
      setCompressionInfo(compressed);
      setUploadProgress(45);
      setStatusMessage("Connecting to wedding gallery...");

      const supabase = createClient();
      const guestId = await getOrCreateGuestSession();
      const photoId = crypto.randomUUID();
      const storagePath = `${eventId}/${photoId}.webp`;

      setUploadProgress(65);
      setStatusMessage("Uploading your moment...");

      // 2. Upload file to Supabase Storage bucket 'wedding-photos'
      const { error: storageError } = await supabase.storage
        .from("wedding-photos")
        .upload(storagePath, compressed.file, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) {
        throw new Error(`Storage upload failed: ${storageError.message}`);
      }

      setUploadProgress(85);
      setStatusMessage("Registering in shared gallery...");

      // 3. Save photo metadata to Supabase PostgreSQL table 'photos'
      const { error: dbError } = await supabase.from("photos").insert({
        id: photoId,
        event_id: eventId,
        guest_id: guestId,
        storage_path: storagePath,
        caption: caption.trim() || null,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        throw new Error(`Database record failed: ${dbError.message}`);
      }

      setUploadProgress(100);
      setStatusMessage("Added to gallery!");
      triggerCelebration();

      // Short delay so guest sees the completion state
      setTimeout(() => {
        onUploaded(photoId);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-black text-white">
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex flex-col">
          <span className="font-serif text-lg tracking-wide text-[#FDFBF7]">Preview Moment</span>
          <span className="text-[11px] text-[#A2C5AC] tracking-wider uppercase">Ready to share</span>
        </div>
      </div>

      {/* Captured Image Center */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Captured wedding moment preview"
          className="max-h-full max-w-full object-contain"
        />

        {/* Compression & Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <UploadProgress
              progress={uploadProgress}
              statusText={statusMessage}
              isComplete={uploadProgress === 100}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 flex flex-col gap-3 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent pb-8">
        {/* Optional Caption Input */}
        {!isUploading && (
          <div className="max-w-md mx-auto w-full">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a loving message or note (optional)..."
              maxLength={120}
              className="w-full rounded-full bg-white/15 border border-white/25 px-4 py-2 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#E26D5C]"
            />
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-center gap-2 max-w-md mx-auto w-full p-3 bg-red-900/80 border border-red-500/50 rounded-xl text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-300" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons: RETAKE & UPLOAD */}
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={onRetake}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white font-medium text-sm tracking-wider uppercase transition active:scale-95 disabled:opacity-50 hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake</span>
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#E26D5C] text-white font-semibold text-sm tracking-wider uppercase shadow-lg shadow-[#E26D5C]/40 transition active:scale-95 disabled:opacity-50 hover:bg-[#d85c4b]"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}
