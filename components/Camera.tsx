"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  ImageUp,
  Sparkles,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  Images,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CaptureButton } from "@/components/CaptureButton";
import { UploadProgress } from "@/components/UploadProgress";
import { compressImage } from "@/lib/image/compress";
import { createClient, getOrCreateGuestSession } from "@/lib/supabase/client";

interface CameraProps {
  eventId: string;
  eventCode: string;
  coupleNames?: string;
  onPhotoUploaded?: (photoId: string) => void;
}

export function Camera({
  eventId,
  eventCode,
  coupleNames = "Rhein & Ruschelle",
  onPhotoUploaded,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // Captured snapshot state (overlay mode)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Session stats
  const [uploadedCount, setUploadedCount] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Stop camera stream cleanly only on full component unmount
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    // If stream is already active with desired facing mode, do not restart
    if (streamRef.current && streamRef.current.active) {
      if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play().catch(() => {});
      }
      return;
    }

    setErrorMessage(null);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setHasPermission(false);
      setErrorMessage(
        "Direct camera access is not supported by this browser. You can still choose photos from your device gallery below."
      );
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((playErr) => {
          console.warn("Camera video play error:", playErr);
        });
      }
      setHasPermission(true);
    } catch (err: unknown) {
      console.warn("Camera access error:", err);
      setHasPermission(false);
      const isDenied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      if (isDenied) {
        setErrorMessage(
          "Camera permission was denied. Please allow camera access in your browser settings or select a photo from your gallery below."
        );
      } else {
        setErrorMessage(
          "Unable to start the camera stream. You can upload any photo directly from your device below."
        );
      }
    }
  }, [facingMode]);

  // Request camera once on mount, clean up only when leaving page
  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  // Switch between front and rear cameras
  const toggleFacingMode = () => {
    stopStream();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#E26D5C", "#9B8EB9", "#8FA8CF", "#F3CA68", "#8DA38B"],
      });
    } catch {
      // Confetti is purely decorative
    }
  };

  // Capture current video frame to canvas without stopping the live stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        setIsCapturing(false);
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setCapturedBlob(blob);
          setCapturedPreviewUrl(previewUrl);
          // NOTE: DO NOT call stopStream() here! Keep the live stream active in background!
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Handle fallback file input selection
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCapturedBlob(file);
    setCapturedPreviewUrl(previewUrl);
  };

  // Retake photo action: simply closes the preview overlay without touching the active stream
  const handleRetake = () => {
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
    }
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
    setCaption("");
    setUploadError(null);
  };

  // Upload photo handler with dual pipeline and auto-reset
  const handleUpload = async () => {
    if (!capturedBlob || isUploading) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(20);
    setUploadStatus("Compressing photo...");

    try {
      // 1. Client-side Image Compression to WebP
      const compressed = await compressImage(capturedBlob, {
        maxDimension: 1600,
        quality: 0.8,
      });

      setUploadProgress(50);
      setUploadStatus("Saving to wedding gallery...");

      const supabase = createClient();
      const guestId = await getOrCreateGuestSession();
      const photoId = crypto.randomUUID();
      const storagePath = `${eventId}/${photoId}.webp`;

      let uploadedSuccessfully = false;

      // 2. Direct client upload attempt
      const { error: storageError } = await supabase.storage
        .from("wedding-photos")
        .upload(storagePath, compressed.file, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (!storageError) {
        const { error: dbError } = await supabase.from("photos").insert({
          id: photoId,
          event_id: eventId,
          guest_id: guestId,
          storage_path: storagePath,
          caption: caption.trim() || null,
          created_at: new Date().toISOString(),
        });

        if (!dbError) {
          uploadedSuccessfully = true;
        }
      }

      // 3. Fallback via server API route if client upload encountered RLS
      if (!uploadedSuccessfully) {
        setUploadStatus("Connecting via server route...");
        const formData = new FormData();
        formData.append("file", compressed.file);
        formData.append("eventId", eventId);
        formData.append("guestId", guestId);
        if (caption.trim()) {
          formData.append("caption", caption.trim());
        }

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || json.error) {
          throw new Error(
            json.error || "Upload failed. Please verify your connection."
          );
        }
      }

      // 4. Success celebration
      setUploadProgress(100);
      setUploadStatus("Added to gallery!");
      triggerCelebration();

      setUploadedCount((prev) => prev + 1);
      setShowSuccessToast(true);

      if (onPhotoUploaded) {
        onPhotoUploaded(photoId);
      }

      // 5. Automatically dismiss preview overlay after 1.2s and return to live camera
      setTimeout(() => {
        handleRetake();
        setIsUploading(false);
      }, 1200);

      // Hide toast after 4s
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo.";
      setUploadError(msg);
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-black text-white overflow-hidden select-none">
      {/* Hidden file input for fallback gallery picking (select from photo album) */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Top Wedding Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <Link
          href={`/e/${eventCode}`}
          className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-xs text-white hover:bg-white/25 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Event</span>
        </Link>

        {/* Couple Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="font-serif text-lg sm:text-xl tracking-wider text-[#FDFBF7]">
            {coupleNames}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#A2C5AC] flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            Live Guest Camera
          </span>
        </div>

        {/* Gallery Link with Upload Counter */}
        <Link
          href={`/e/${eventCode}/gallery`}
          className="flex items-center gap-1.5 rounded-full bg-[#E26D5C] px-3 py-1.5 text-xs text-white shadow-sm hover:bg-[#d45d55] transition"
        >
          <Images className="h-3.5 w-3.5" />
          <span>Gallery{uploadedCount > 0 ? ` (${uploadedCount})` : ""}</span>
        </Link>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="absolute top-16 left-4 right-4 z-40 flex items-center justify-center animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 rounded-full bg-[#8DA38B] px-4 py-2 text-xs font-semibold text-white shadow-xl">
            <CheckCircle2 className="h-4 w-4" />
            <span>Photo added! Ready for next shot.</span>
          </div>
        </div>
      )}

      {/* Persistent Live Camera Viewfinder (Always Mounted) */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {hasPermission === false ? (
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto gap-4 z-10">
            <div className="h-16 w-16 rounded-full bg-[#E26D5C]/20 flex items-center justify-center text-[#E26D5C]">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-xl text-white">Camera Access Needed</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {errorMessage || "Please allow camera access to take moments directly."}
              </p>
            </div>

            <div className="flex flex-col w-full gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#E26D5C] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#E26D5C]/40 active:scale-95 transition"
              >
                <ImageUp className="h-4 w-4" />
                <span>Upload From Gallery</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium hover:bg-white/20 active:scale-95 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Camera Again</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`h-full w-full object-cover ${
                facingMode === "user" ? "scale-x-[-1]" : ""
              }`}
            />

            {/* Viewfinder Guides */}
            <div className="pointer-events-none absolute inset-8 border border-white/20 rounded-2xl">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/70" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white/70" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white/70" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/70" />
            </div>
          </>
        )}

        {/* Captured Photo Preview Overlay (Rendered directly on top without unmounting video) */}
        {capturedPreviewUrl && (
          <div className="absolute inset-0 z-30 flex flex-col bg-black text-white animate-in fade-in duration-200">
            {/* Overlay Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-wide text-[#FDFBF7]">Preview Moment</span>
                <span className="text-[11px] text-[#A2C5AC] tracking-wider uppercase">Ready to share</span>
              </div>

              <button
                type="button"
                onClick={handleRetake}
                disabled={isUploading}
                className="rounded-full bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/30"
              >
                Cancel
              </button>
            </div>

            {/* Image Preview Canvas */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedPreviewUrl}
                alt="Captured wedding moment preview"
                className="max-h-full max-w-full object-contain rounded-xl"
              />

              {/* Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                  <UploadProgress
                    progress={uploadProgress}
                    statusText={uploadStatus}
                    isComplete={uploadProgress === 100}
                  />
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="relative z-20 flex flex-col gap-3 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent pb-8">
              {/* Caption Input */}
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

              {/* Error Alert */}
              {uploadError && (
                <div className="flex items-center gap-2 max-w-md mx-auto w-full p-3 bg-red-900/85 border border-red-500/50 rounded-xl text-xs text-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-300" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Action Buttons: RETAKE & UPLOAD */}
              <div className="flex items-center justify-center gap-4 max-w-md mx-auto w-full">
                <button
                  type="button"
                  onClick={handleRetake}
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
        )}
      </div>

      {/* Bottom Shutter Bar (Visible when not reviewing a photo) */}
      {!capturedPreviewUrl && hasPermission !== false && (
        <div className="relative z-20 flex items-center justify-around p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pb-8">
          {/* File Picker Fallback Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload existing photo"
            className="flex flex-col items-center gap-1 rounded-full p-3 bg-white/15 backdrop-blur-md text-white/90 hover:bg-white/25 active:scale-90 transition"
          >
            <ImageUp className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">Gallery</span>
          </button>

          {/* Large Shutter Button */}
          <CaptureButton
            onClick={handleCapture}
            disabled={!hasPermission}
            isCapturing={isCapturing}
          />

          {/* Camera Flip (Rear / Front) */}
          <button
            type="button"
            onClick={toggleFacingMode}
            title="Flip camera"
            className="flex flex-col items-center gap-1 rounded-full p-3 bg-white/15 backdrop-blur-md text-white/90 hover:bg-white/25 active:scale-90 transition"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">Flip</span>
          </button>
        </div>
      )}
    </div>
  );
}
