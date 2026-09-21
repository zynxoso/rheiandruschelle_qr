"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Camera as CameraIcon,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  ImageUp,
  Sparkles,
} from "lucide-react";
import { CaptureButton } from "@/components/CaptureButton";
import { PhotoPreview } from "@/components/PhotoPreview";

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
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Stop camera stream cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    stopStream();
    setErrorMessage(null);

    // Check if getUserMedia is supported in browser
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setHasPermission(false);
      setErrorMessage(
        "Direct camera access is not supported by this browser. You can still upload photos from your device gallery below."
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
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
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
          "Camera permission was denied. Please allow camera access in your browser settings or choose a photo from your gallery below."
        );
      } else {
        setErrorMessage(
          "Unable to start the camera stream. You can upload any photo directly from your phone below."
        );
      }
    }
  }, [facingMode, stopStream]);

  // Request camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
      if (capturedPreviewUrl) {
        URL.revokeObjectURL(capturedPreviewUrl);
      }
    };
  }, [startCamera, stopStream, capturedPreviewUrl]);

  // Switch between front and rear cameras
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Capture current video frame to canvas
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

    // Mirror horizontal when using front camera
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
          stopStream();
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
    stopStream();
  };

  // Retake photo action
  const handleRetake = () => {
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
    }
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
    startCamera();
  };

  // Photo uploaded callback
  const handleUploaded = (photoId: string) => {
    if (onPhotoUploaded) {
      onPhotoUploaded(photoId);
    }
  };

  // If in preview mode, render PhotoPreview
  if (capturedBlob && capturedPreviewUrl) {
    return (
      <PhotoPreview
        imageBlob={capturedBlob}
        previewUrl={capturedPreviewUrl}
        eventId={eventId}
        eventCode={eventCode}
        onRetake={handleRetake}
        onUploaded={handleUploaded}
      />
    );
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-black text-white overflow-hidden select-none">
      {/* Hidden file input for fallback upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
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

        {/* Gallery Link */}
        <Link
          href={`/e/${eventCode}/gallery`}
          className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-xs text-white hover:bg-white/25 transition"
        >
          Gallery
        </Link>
      </div>

      {/* Camera Live Viewfinder or Permission Denied View */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {hasPermission === false ? (
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto gap-4">
            <div className="h-16 w-16 rounded-full bg-[#E26D5C]/20 flex items-center justify-center text-[#E26D5C]">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-xl text-white">Camera Access Needed</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {errorMessage || "Please allow camera access to capture moments directly."}
              </p>
            </div>

            <div className="flex flex-col w-full gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#E26D5C] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#E26D5C]/40 active:scale-95 transition"
              >
                <ImageUp className="h-4 w-4" />
                <span>Upload From Device</span>
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

            {/* Viewfinder Decorative Framing Guides */}
            <div className="pointer-events-none absolute inset-8 border border-white/20 rounded-2xl">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/70" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white/70" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white/70" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/70" />
            </div>
          </>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      {hasPermission !== false && (
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
