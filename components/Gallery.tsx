"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { createClient, getPhotoPublicUrl } from "@/lib/supabase/client";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import type { Photo } from "@/types/database";

interface GalleryProps {
  eventId: string;
  eventCode: string;
  initialPhotos?: Photo[];
  coupleNames?: string;
  isAdmin?: boolean;
}

export function Gallery({
  eventId,
  eventCode,
  initialPhotos = [],
  coupleNames = "Rhein & Ruschelle",
  isAdmin = false,
}: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(initialPhotos.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set());

  // Fetch photos from Supabase
  const fetchPhotos = React.useCallback(async () => {
    setIsRefreshing(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", eventId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, [eventId]);

  useEffect(() => {
    fetchPhotos();

    // ⚡ Supabase Realtime Channel Subscription
    const supabase = createClient();
    const channelName = `realtime-gallery-${eventId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newPhoto = payload.new as Photo;
          if (newPhoto && !newPhoto.deleted_at) {
            setPhotos((prev) => {
              // Avoid duplicates
              if (prev.some((p) => p.id === newPhoto.id)) return prev;
              return [newPhoto, ...prev];
            });

            // Highlight with subtle animation badge
            setNewPhotoIds((prev) => new Set(prev).add(newPhoto.id));
            setTimeout(() => {
              setNewPhotoIds((prev) => {
                const next = new Set(prev);
                next.delete(newPhoto.id);
                return next;
              });
            }, 4000);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const updated = payload.new as Photo;
          if (updated.deleted_at) {
            // Remove deleted photos from gallery in real-time
            setPhotos((prev) => prev.filter((p) => p.id !== updated.id));
          } else {
            setPhotos((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const deleted = payload.old as { id: string };
          if (deleted?.id) {
            setPhotos((prev) => prev.filter((p) => p.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, fetchPhotos]);

  const handleDeletePhoto = async (photo: Photo) => {
    const supabase = createClient();
    // Soft delete by updating deleted_at timestamp
    const { error } = await supabase
      .from("photos")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", photo.id);

    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setSelectedPhoto(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      {/* Gallery Heading */}
      <div className="flex flex-col items-center text-center mb-10">
        <span className="font-serif text-sm tracking-widest text-[#E26D5C] uppercase font-semibold">
          {coupleNames}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#242D35] mt-2 tracking-wide font-normal">
          OUR WEDDING MEMORIES
        </h1>
        <p className="font-serif italic text-sm text-[#7C8793] mt-2">
          “Moments captured by our guests”
        </p>

        {/* Action Controls & Live Indicator */}
        <div className="flex items-center gap-3 mt-6">
          <Link
            href={`/e/${eventCode}/camera`}
            className="flex items-center gap-2 rounded-full bg-[#E26D5C] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-md shadow-[#E26D5C]/30 hover:bg-[#d45d55] active:scale-95 transition"
          >
            <Camera className="h-4 w-4" />
            <span>Take a Photo</span>
          </Link>

          <button
            type="button"
            onClick={fetchPhotos}
            disabled={isRefreshing}
            title="Refresh gallery"
            className="flex items-center gap-1.5 rounded-full border border-[#E9DECB] bg-white/80 px-3.5 py-2.5 text-xs font-medium text-[#242D35] hover:bg-white active:scale-95 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#E26D5C]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Realtime Live Pulse Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#8DA38B]/15 px-3 py-1.5 text-[11px] font-medium text-[#7A9478]">
            <span className="h-2 w-2 rounded-full bg-[#8DA38B] animate-pulse" />
            <span>Live Sync</span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-[#F3EFE6] animate-pulse border border-[#E9DECB]/50"
            />
          ))}
        </div>
      ) : photos.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-3xl border border-[#E9DECB]/70 shadow-sm max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-[#FDF4EE] flex items-center justify-center text-[#E26D5C] mb-4">
            <Camera className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl text-[#242D35]">
            No memories captured yet
          </h3>
          <p className="font-serif italic text-sm text-[#7C8793] mt-2 max-w-xs">
            “Be the first to share a moment from this special day.”
          </p>
          <Link
            href={`/e/${eventCode}/camera`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E26D5C] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#E26D5C]/30 hover:bg-[#d45d55] active:scale-95 transition"
          >
            <Camera className="h-4 w-4" />
            <span>Open Camera</span>
          </Link>
        </div>
      ) : (
        /* Responsive Masonry Photo Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo) => {
            const isNew = newPhotoIds.has(photo.id);
            const publicUrl = getPhotoPublicUrl(photo.storage_path);

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-[#F3EFE6] border border-[#E9DECB]/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] ${
                  isNew ? "ring-2 ring-[#E26D5C] animate-in zoom-in-95 duration-500" : ""
                }`}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl}
                  alt={photo.caption || "Wedding memory"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Just Uploaded Badge */}
                {isNew && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[#E26D5C] text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Just Added</span>
                  </div>
                )}

                {/* Hover / Touch Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  {photo.caption && (
                    <p className="text-xs font-serif italic line-clamp-2 drop-shadow">
                      “{photo.caption}”
                    </p>
                  )}
                  <span className="text-[10px] text-white/80 mt-1 font-sans">
                    {new Date(photo.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        isAdmin={isAdmin}
        onClose={() => setSelectedPhoto(null)}
        onDelete={handleDeletePhoto}
      />
    </div>
  );
}
