"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Calendar, Heart, MapPin, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FloralFrame } from "@/components/FloralDecoration";

export default function CreateEventPage() {
  const router = useRouter();
  const [coupleNames, setCoupleNames] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-16");
  const [ceremonyLocation, setCeremonyLocation] = useState("Iglesia Ni Cristo Lokal ng Guimba");
  const [ceremonyTime, setCeremonyTime] = useState("3:00 PM");
  const [receptionLocation, setReceptionLocation] = useState("La Herminias Resort");
  const [receptionTime, setReceptionTime] = useState("4:00 PM");
  const [tagline, setTagline] = useState("Capture a moment from our special day.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate code when couple names change
  const handleNamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoupleNames(val);
    if (!eventCode || eventCode.includes("-")) {
      const generated = val
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      if (generated) {
        setEventCode(`${generated}-2026`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanCode = eventCode.trim().toLowerCase();
    if (!coupleNames.trim() || !cleanCode || !eventDate) {
      setErrorMessage("Please fill in the couple names, event code, and date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const newEventId = crypto.randomUUID();

      const themeData = {
        name: "Spring Pastel Wedding",
        coupleNames: coupleNames.trim(),
        tagline: tagline.trim(),
        ceremonyTime: ceremonyTime.trim(),
        ceremonyLocation: ceremonyLocation.trim(),
        receptionTime: receptionTime.trim(),
        receptionLocation: receptionLocation.trim(),
        colors: {
          background: "#FDFBF7",
          primary: "#E26D5C",
          secondary: "#9B8EB9",
          accent: "#8FA8CF",
          buttercup: "#F3CA68",
          peach: "#F4A261",
          sage: "#8DA38B",
          mint: "#A2C5AC",
          sand: "#E9DECB",
          charcoal: "#242D35",
        },
      };

      const { data, error } = await supabase
        .from("events")
        .insert({
          id: newEventId,
          name: coupleNames.trim(),
          event_code: cleanCode,
          event_date: eventDate,
          cover_image: "/images/wedding_invitation.png",
          theme: themeData,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      router.push(`/admin/${newEventId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create event.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <FloralFrame showCorners={true}>
      <div className="min-h-screen py-12 px-4 sm:px-6 max-w-xl mx-auto flex flex-col justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#7C8793] hover:text-[#242D35] mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-10 border border-[#E9DECB] shadow-xl">
          <div className="flex items-center gap-2 text-[#E26D5C]">
            <Heart className="h-5 w-5 fill-[#E26D5C]" />
            <span className="text-xs font-semibold uppercase tracking-widest font-sans">
              Wedding Moments
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#242D35] mt-2 font-normal">
            Create Wedding Event
          </h1>
          <p className="text-xs text-[#7C8793] mt-1.5 leading-relaxed">
            Generate an event page, mobile camera link, and printable QR code for wedding guests.
          </p>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                Couple Names
              </label>
              <input
                type="text"
                required
                value={coupleNames}
                onChange={handleNamesChange}
                placeholder="e.g. Rhein & Ruschelle"
                className="w-full rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-4 py-2.5 text-sm text-[#242D35] focus:outline-none focus:ring-2 focus:ring-[#E26D5C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                  Event Code (URL Slug)
                </label>
                <input
                  type="text"
                  required
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="rhein-ruschelle-2026"
                  className="w-full rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-4 py-2.5 text-sm text-[#242D35] font-mono focus:outline-none focus:ring-2 focus:ring-[#E26D5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                  Wedding Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-4 py-2.5 text-sm text-[#242D35] focus:outline-none focus:ring-2 focus:ring-[#E26D5C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                Ceremony Details
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={ceremonyTime}
                  onChange={(e) => setCeremonyTime(e.target.value)}
                  placeholder="3:00 PM"
                  className="rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-3 py-2 text-xs text-[#242D35]"
                />
                <input
                  type="text"
                  value={ceremonyLocation}
                  onChange={(e) => setCeremonyLocation(e.target.value)}
                  placeholder="Iglesia Ni Cristo Lokal ng Guimba"
                  className="col-span-2 rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-3 py-2 text-xs text-[#242D35]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                Reception Details
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={receptionTime}
                  onChange={(e) => setReceptionTime(e.target.value)}
                  placeholder="4:00 PM"
                  className="rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-3 py-2 text-xs text-[#242D35]"
                />
                <input
                  type="text"
                  value={receptionLocation}
                  onChange={(e) => setReceptionLocation(e.target.value)}
                  placeholder="La Herminias Resort"
                  className="col-span-2 rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-3 py-2 text-xs text-[#242D35]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#242D35] mb-1">
                Guest Page Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Capture a moment from our special day."
                className="w-full rounded-xl border border-[#E9DECB] bg-[#FDFBF7] px-4 py-2 text-xs text-[#242D35]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#E26D5C] text-white font-semibold text-sm tracking-wider uppercase shadow-lg shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Event...</span>
                </>
              ) : (
                <>
                  <span>Create & View QR Card</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </FloralFrame>
  );
}
