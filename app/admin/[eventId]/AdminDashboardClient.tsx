"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Image as ImageIcon,
  QrCode,
  Lock,
  Unlock,
  Trash2,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Power,
  HardDrive,
  Images,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { createClient, getPhotoPublicUrl } from "@/lib/supabase/client";
import { QRCodeCard } from "@/components/QRCodeCard";
import type { WeddingEvent, Photo } from "@/types/database";

interface AdminDashboardClientProps {
  initialEvent: WeddingEvent;
  initialPhotos: Photo[];
}

export function AdminDashboardClient({
  initialEvent,
  initialPhotos,
}: AdminDashboardClientProps) {
  const [event, setEvent] = useState<WeddingEvent>(initialEvent);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [passphraseInput, setPassphraseInput] = useState("");
  const [passphraseError, setPassphraseError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "deleted">("active");
  const [copiedLink, setCopiedLink] = useState(false);

  const coupleNames = event.theme?.coupleNames || event.name;
  const activePhotos = photos.filter((p) => !p.deleted_at);
  const deletedPhotos = photos.filter((p) => p.deleted_at);

  // Storage estimate in Megabytes (~250 KB per compressed WebP)
  const estimatedStorageMb = ((photos.length * 250) / 1024).toFixed(1);

  // Toggle active/inactive event state
  const handleToggleEventStatus = async () => {
    setIsUpdatingStatus(true);
    const supabase = createClient();
    const newStatus = !event.is_active;

    const { error } = await supabase
      .from("events")
      .update({ is_active: newStatus })
      .eq("id", event.id);

    if (!error) {
      setEvent((prev) => ({ ...prev, is_active: newStatus }));
    }
    setIsUpdatingStatus(false);
  };

  // Moderation: Soft delete or restore photo
  const handleTogglePhotoDelete = async (photo: Photo) => {
    const supabase = createClient();
    const willDelete = !photo.deleted_at;
    const newDeletedAt = willDelete ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("photos")
      .update({ deleted_at: newDeletedAt })
      .eq("id", photo.id);

    if (!error) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, deleted_at: newDeletedAt } : p))
      );
    }
  };

  // Moderation: Permanent delete
  const handlePermanentDelete = async (photo: Photo) => {
    if (!confirm("Are you sure you want to permanently delete this photo?")) return;

    const supabase = createClient();
    // 1. Delete from storage bucket
    await supabase.storage.from("wedding-photos").remove([photo.storage_path]);

    // 2. Delete database row
    const { error } = await supabase.from("photos").delete().eq("id", photo.id);

    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    }
  };

  const displayedPhotos = photos.filter((p) => {
    if (filter === "active") return !p.deleted_at;
    if (filter === "deleted") return !!p.deleted_at;
    return true;
  });

  const guestUrl = typeof window !== "undefined"
    ? `${window.location.origin}/e/${event.event_code}`
    : `/e/${event.event_code}`;

  const handleCopyGuestUrl = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full">
      {/* Top Admin Navigation */}
      <header className="border-b border-[#E9DECB] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E26D5C] text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl text-[#242D35] font-normal">
                  {coupleNames}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                    event.is_active
                      ? "bg-[#8DA38B]/20 text-[#6B8569]"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.is_active ? "Active" : "Paused"}
                </span>
              </div>
              <p className="text-xs text-[#7C8793]">
                Event Code: <code className="font-mono font-semibold text-[#E26D5C]">{event.event_code}</code> • {event.event_date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href={`/e/${event.event_code}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-full border border-[#E9DECB] bg-white px-3.5 py-2 text-xs font-semibold text-[#242D35] hover:bg-[#FDFBF7] transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Guest View</span>
            </Link>

            <Link
              href={`/e/${event.event_code}/gallery`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-full bg-[#E26D5C] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#d45d55] transition"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Live Gallery</span>
            </Link>

            <button
              type="button"
              onClick={handleToggleEventStatus}
              disabled={isUpdatingStatus}
              title={event.is_active ? "Deactivate event" : "Activate event"}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                event.is_active
                  ? "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border border-green-300 bg-green-50 text-green-900 hover:bg-green-100"
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{event.is_active ? "Pause Uploads" : "Resume Uploads"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-[#E9DECB] shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-[#7C8793]">
              <span className="text-xs uppercase tracking-wider font-medium">Live Photos</span>
              <Images className="h-4 w-4 text-[#E26D5C]" />
            </div>
            <span className="font-serif text-3xl sm:text-4xl text-[#242D35] mt-2 font-normal">
              {activePhotos.length}
            </span>
            <span className="text-[11px] text-[#8DA38B] mt-1">Available in gallery</span>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#E9DECB] shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-[#7C8793]">
              <span className="text-xs uppercase tracking-wider font-medium">Moderated</span>
              <Trash2 className="h-4 w-4 text-[#9B8EB9]" />
            </div>
            <span className="font-serif text-3xl sm:text-4xl text-[#242D35] mt-2 font-normal">
              {deletedPhotos.length}
            </span>
            <span className="text-[11px] text-[#7C8793] mt-1">Hidden from guests</span>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#E9DECB] shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-[#7C8793]">
              <span className="text-xs uppercase tracking-wider font-medium">Est. Storage</span>
              <HardDrive className="h-4 w-4 text-[#8FA8CF]" />
            </div>
            <span className="font-serif text-3xl sm:text-4xl text-[#242D35] mt-2 font-normal">
              {estimatedStorageMb} <span className="text-lg">MB</span>
            </span>
            <span className="text-[11px] text-[#7C8793] mt-1">WebP compressed</span>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#E9DECB] shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-[#7C8793]">
              <span className="text-xs uppercase tracking-wider font-medium">Event Status</span>
              <Power className="h-4 w-4 text-[#8DA38B]" />
            </div>
            <span className="font-serif text-2xl sm:text-3xl text-[#242D35] mt-2 font-normal">
              {event.is_active ? "Accepting" : "Paused"}
            </span>
            <button
              type="button"
              onClick={handleCopyGuestUrl}
              className="flex items-center gap-1 text-[11px] text-[#E26D5C] hover:underline mt-1 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Guest Link"}</span>
            </button>
          </div>
        </div>

        {/* Printable QR Code Card Section */}
        <section className="flex flex-col lg:flex-row gap-8 items-start bg-white/60 p-6 sm:p-8 rounded-3xl border border-[#E9DECB]">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#E26D5C]">
              <QrCode className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest font-sans">
                Wedding Table Card & QR Code
              </span>
            </div>
            <h2 className="font-serif text-3xl text-[#242D35]">
              Printable Guest Camera QR Code
            </h2>
            <p className="text-sm text-[#7C8793] leading-relaxed">
              Place this QR card on reception tables, wedding invitations, and greeting signboards.
              Guests scan the QR code with their mobile phone camera to open the wedding page, capture live photos, and view the real-time shared gallery.
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs text-[#242D35]/80 font-mono bg-[#FDFBF7] p-4 rounded-xl border border-[#E9DECB]">
              <div><strong>Direct URL:</strong> {guestUrl}</div>
              <div><strong>Event Slug:</strong> {event.event_code}</div>
              <div><strong>Compression:</strong> Client-side 1600px WebP</div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
            <QRCodeCard
              eventCode={event.event_code}
              coupleNames={coupleNames}
              weddingDate={event.event_date}
              themeName={event.theme?.name || "Spring Pastel Wedding"}
            />
          </div>
        </section>

        {/* Photo Moderation Section */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#242D35]">
                Photo Moderation Grid
              </h2>
              <p className="text-xs text-[#7C8793] mt-1">
                View, moderate, or remove photos uploaded by guests. Removed photos instantly vanish from guest screens via Realtime.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-full bg-[#F3EFE6] p-1 border border-[#E9DECB]/80">
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === "active" ? "bg-white text-[#242D35] shadow-xs" : "text-[#7C8793] hover:text-[#242D35]"
                }`}
              >
                Active ({activePhotos.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("deleted")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === "deleted" ? "bg-white text-[#242D35] shadow-xs" : "text-[#7C8793] hover:text-[#242D35]"
                }`}
              >
                Hidden ({deletedPhotos.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === "all" ? "bg-white text-[#242D35] shadow-xs" : "text-[#7C8793] hover:text-[#242D35]"
                }`}
              >
                All ({photos.length})
              </button>
            </div>
          </div>

          {displayedPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-[#E9DECB] text-center">
              <Images className="h-10 w-10 text-[#7C8793]/40 mb-3" />
              <p className="text-sm font-serif text-[#7C8793]">
                No photos found in this view.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedPhotos.map((photo) => {
                const publicUrl = getPhotoPublicUrl(photo.storage_path);
                const isDeleted = !!photo.deleted_at;

                return (
                  <div
                    key={photo.id}
                    className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F3EFE6] border border-[#E9DECB] shadow-xs transition ${
                      isDeleted ? "opacity-60 grayscale" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl}
                      alt={photo.caption || "Guest photo"}
                      className="h-full w-full object-cover"
                    />

                    {/* Status Badge */}
                    {isDeleted && (
                      <div className="absolute top-2 left-2 rounded-full bg-red-600/90 text-white px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                        Hidden
                      </div>
                    )}

                    {/* Hover Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePhotoDelete(photo)}
                          title={isDeleted ? "Restore photo to gallery" : "Hide photo from gallery"}
                          className={`rounded-full p-2 text-white transition active:scale-95 ${
                            isDeleted ? "bg-[#8DA38B] hover:bg-[#7c947a]" : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                          {isDeleted ? <RotateCcw className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePermanentDelete(photo)}
                          title="Permanently erase photo and file"
                          className="rounded-full bg-red-700 p-2 text-white hover:bg-red-800 transition active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div>
                        {photo.caption && (
                          <p className="text-xs font-serif italic line-clamp-2">
                            “{photo.caption}”
                          </p>
                        )}
                        <span className="text-[10px] text-white/70 block mt-1">
                          {new Date(photo.created_at).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
